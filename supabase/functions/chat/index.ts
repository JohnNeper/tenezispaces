import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const userId = claimsData.claims.sub;

    const { spaceId, message, history = [] } = await req.json();
    if (!spaceId || !message) {
      return new Response(JSON.stringify({ error: "spaceId and message are required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Use service role for DB operations
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check membership
    const { data: membership } = await adminClient
      .from("space_members")
      .select("id")
      .eq("space_id", spaceId)
      .eq("user_id", userId)
      .single();

    if (!membership) {
      return new Response(JSON.stringify({ error: "Not a member of this space" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Generate embedding for the query
    const embeddingResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "Generate a semantic search query embedding representation. Return ONLY a JSON array of 768 floating point numbers between -1 and 1 that represents the semantic meaning of the user's query. No other text." },
          { role: "user", content: message },
        ],
      }),
    });

    let relevantChunks: any[] = [];
    
    if (embeddingResponse.ok) {
      try {
        const embData = await embeddingResponse.json();
        const embText = embData.choices?.[0]?.message?.content || "";
        const embMatch = embText.match(/\[[\s\S]*\]/);
        if (embMatch) {
          const embedding = JSON.parse(embMatch[0]);
          if (Array.isArray(embedding) && embedding.length === 768) {
            const { data: chunks } = await adminClient.rpc("match_document_chunks", {
              query_embedding: embedding,
              match_space_id: spaceId,
              match_threshold: 0.3,
              match_count: 5,
            });
            if (chunks) relevantChunks = chunks;
          }
        }
      } catch (e) {
        console.error("Embedding parsing error:", e);
      }
    }

    // If no vector results, fall back to text search
    if (relevantChunks.length === 0) {
      const { data: textChunks } = await adminClient
        .from("document_chunks")
        .select("id, document_id, content, chunk_index, metadata")
        .eq("space_id", spaceId)
        .textSearch("content", message.split(" ").slice(0, 5).join(" & "), { type: "plain" })
        .limit(5);
      
      if (textChunks && textChunks.length > 0) {
        relevantChunks = textChunks.map((c: any) => ({ ...c, similarity: 0.5 }));
      }
    }

    // Get document names for sources
    const docIds = [...new Set(relevantChunks.map((c: any) => c.document_id))];
    let docNames: Record<string, { name: string; type: string }> = {};
    if (docIds.length > 0) {
      const { data: docs } = await adminClient
        .from("documents")
        .select("id, name, type")
        .in("id", docIds);
      if (docs) {
        docs.forEach((d: any) => { docNames[d.id] = { name: d.name, type: d.type }; });
      }
    }

    // Build context
    const context = relevantChunks
      .map((c: any) => `[Source: ${docNames[c.document_id]?.name || "Unknown"}]\n${c.content}`)
      .join("\n\n---\n\n");

    const systemPrompt = context
      ? `Tu es un assistant IA intégré dans un espace de travail collaboratif. Tu as accès aux documents suivants pour répondre aux questions. Cite tes sources quand tu utilises des informations des documents. Réponds dans la langue de l'utilisateur.\n\nDocuments disponibles:\n${context}`
      : `Tu es un assistant IA intégré dans un espace de travail collaboratif. Aucun document n'est disponible pour le moment. Réponds aux questions en te basant sur tes connaissances générales. Réponds dans la langue de l'utilisateur.`;

    // Save user message
    await adminClient.from("messages").insert({
      space_id: spaceId,
      user_id: userId,
      content: message,
      role: "user",
      sources: [],
    });

    // Stream response from AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...history.slice(-10),
          { role: "user", content: message },
        ],
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requêtes atteinte, réessayez plus tard." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA épuisés. Veuillez recharger votre compte." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", status, errText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Build sources for saving later
    const sources = Object.values(docNames).map((d: any) => ({ name: d.name, type: d.type }));

    // Create a transform stream that captures the full response
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = aiResponse.body!.getReader();
    const decoder = new TextDecoder();
    let fullContent = "";

    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          await writer.write(new TextEncoder().encode(text));
          
          // Parse content for saving
          for (const line of text.split("\n")) {
            if (!line.startsWith("data: ") || line.includes("[DONE]")) continue;
            try {
              const parsed = JSON.parse(line.slice(6));
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) fullContent += content;
            } catch {}
          }
        }
      } finally {
        // Save the complete AI response
        if (fullContent) {
          await adminClient.from("messages").insert({
            space_id: spaceId,
            user_id: null,
            content: fullContent,
            role: "assistant",
            sources,
          });
        }
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
