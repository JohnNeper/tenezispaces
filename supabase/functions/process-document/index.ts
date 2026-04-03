import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }
  return chunks;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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

    const { documentId } = await req.json();
    if (!documentId) {
      return new Response(JSON.stringify({ error: "documentId is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get document info
    const { data: doc, error: docError } = await adminClient
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (docError || !doc) {
      return new Response(JSON.stringify({ error: "Document not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Update status to processing
    await adminClient.from("documents").update({ status: "processing" }).eq("id", documentId);

    // Download file from storage
    const { data: fileData, error: fileError } = await adminClient.storage
      .from("space-documents")
      .download(doc.storage_path);

    if (fileError || !fileData) {
      await adminClient.from("documents").update({ status: "error" }).eq("id", documentId);
      return new Response(JSON.stringify({ error: "Failed to download file" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Extract text based on type
    let text = "";
    const fileType = doc.type.toLowerCase();

    if (["txt", "md", "csv", "json", "xml", "html"].includes(fileType)) {
      text = await fileData.text();
    } else if (fileType === "pdf") {
      // For PDF, use AI to extract text from the content
      const base64 = btoa(String.fromCharCode(...new Uint8Array(await fileData.arrayBuffer())));
      const extractResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "Extract ALL text content from this document. Return only the raw text, preserving paragraphs and structure. Do not add any commentary." },
            { role: "user", content: `Extract text from this ${fileType} document (base64 encoded, first 50000 chars): ${base64.substring(0, 50000)}` },
          ],
        }),
      });
      if (extractResponse.ok) {
        const extractData = await extractResponse.json();
        text = extractData.choices?.[0]?.message?.content || "";
      }
    } else {
      // For other formats, try to read as text
      try {
        text = await fileData.text();
      } catch {
        text = `Document de type ${fileType}. Le contenu ne peut pas être extrait automatiquement.`;
      }
    }

    if (!text.trim()) {
      await adminClient.from("documents").update({ status: "error" }).eq("id", documentId);
      return new Response(JSON.stringify({ error: "No text content extracted" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Chunk the text
    const chunks = chunkText(text);

    // Delete existing chunks for this document
    await adminClient.from("document_chunks").delete().eq("document_id", documentId);

    // Generate embeddings and insert chunks
    let successCount = 0;
    for (let i = 0; i < chunks.length; i++) {
      try {
        // Generate embedding via AI
        const embResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite",
            messages: [
              { role: "system", content: "Generate a semantic embedding as a JSON array of exactly 768 floating point numbers between -1 and 1. Return ONLY the JSON array, nothing else." },
              { role: "user", content: chunks[i].substring(0, 2000) },
            ],
          }),
        });

        let embedding = null;
        if (embResponse.ok) {
          const embData = await embResponse.json();
          const embText = embData.choices?.[0]?.message?.content || "";
          const match = embText.match(/\[[\s\S]*\]/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            if (Array.isArray(parsed) && parsed.length === 768) {
              embedding = parsed;
            }
          }
        }

        await adminClient.from("document_chunks").insert({
          document_id: documentId,
          space_id: doc.space_id,
          content: chunks[i],
          chunk_index: i,
          embedding: embedding ? `[${embedding.join(",")}]` : null,
          metadata: { source: doc.name, type: doc.type, chunk: i, total: chunks.length },
        });
        successCount++;

        // Small delay to avoid rate limits
        if (i < chunks.length - 1) {
          await new Promise(r => setTimeout(r, 500));
        }
      } catch (e) {
        console.error(`Error processing chunk ${i}:`, e);
      }
    }

    // Update document status
    await adminClient.from("documents").update({
      status: "ready",
      chunk_count: successCount,
    }).eq("id", documentId);

    return new Response(JSON.stringify({
      success: true,
      chunks: successCount,
      total: chunks.length,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("process-document error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
