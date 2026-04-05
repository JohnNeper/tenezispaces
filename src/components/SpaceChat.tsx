import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send, Bot, User, Sparkles, FileText, Clock, Users, MessageSquare, Upload, Loader2, CheckCircle2, AlertCircle, Trash2
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useSpaceMessages, useTeamMessages } from "@/hooks/useSpaces";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { DocumentUploadModal } from "./DocumentUploadModal";

interface SpaceDocument {
  id: string;
  name: string;
  type: string;
  status: string | null;
  chunk_count: number | null;
  size_bytes: number | null;
  created_at: string;
}

interface SpaceChatProps {
  spaceId: string;
  spaceName: string;
  aiModel: string;
  documents: SpaceDocument[];
  onRefreshDocuments?: () => void;
}

const statusIcon = (status: string | null) => {
  switch (status) {
    case 'ready': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 'processing': return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
    case 'error': return <AlertCircle className="w-4 h-4 text-destructive" />;
    default: return <Loader2 className="w-4 h-4 text-muted-foreground" />;
  }
};

const formatSize = (bytes: number | null) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
};

export const SpaceChat = ({ spaceId, spaceName, aiModel, documents, onRefreshDocuments }: SpaceChatProps) => {
  const [input, setInput] = useState("");
  const [teamInput, setTeamInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ai");
  const [streamingContent, setStreamingContent] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const teamEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { user } = useAuth();
  const { messages, setMessages } = useSpaceMessages(spaceId);
  const { messages: teamMessages, sendTeamMessage } = useTeamMessages(spaceId);

  const scrollToBottom = () => {
    if (activeTab === "ai") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      teamEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => { scrollToBottom(); }, [messages, teamMessages, streamingContent, activeTab]);

  const readyDocs = documents.filter(d => d.status === 'ready');

  const handleDeleteDoc = async (docId: string) => {
    await supabase.from('document_chunks').delete().eq('document_id', docId);
    await supabase.from('documents').delete().eq('id', docId);
    onRefreshDocuments?.();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !user) return;
    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setStreamingContent("");

    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      space_id: spaceId,
      user_id: user.id,
      content: userMessage,
      role: "user",
      sources: [],
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const history = messages.slice(-10).map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ spaceId, message: userMessage, history }),
        }
      );

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: "Erreur inconnue" }));
        throw new Error(errData.error || `HTTP ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullContent += content;
              setStreamingContent(fullContent);
            }
          } catch {}
        }
      }

      setStreamingContent("");
      setTimeout(() => {
        setMessages(prev => {
          if (prev.some(m => m.role === "assistant" && m.content === fullContent)) return prev;
          return [...prev, {
            id: `ai-${Date.now()}`,
            space_id: spaceId,
            user_id: null,
            content: fullContent,
            role: "assistant",
            sources: [],
            created_at: new Date().toISOString(),
          }];
        });
      }, 2000);
    } catch (error: any) {
      console.error("Chat error:", error);
      setStreamingContent("");
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        space_id: spaceId,
        user_id: null,
        content: `❌ ${error.message || t("chat.error")}`,
        role: "assistant",
        sources: [],
        created_at: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamSend = async () => {
    if (!teamInput.trim() || !user) return;
    const msg = teamInput.trim();
    setTeamInput("");
    await sendTeamMessage(msg, user.id);
  };

  const handleKeyPress = (e: React.KeyboardEvent, handler: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handler();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4 bg-background/95 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-glow">
              {spaceName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{spaceName}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Bot className="w-3 h-3 mr-1" />
                  IA
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-secondary/80"
                  onClick={() => setShowDocs(!showDocs)}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  {readyDocs.length}/{documents.length} docs
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowUpload(true)} className="gap-2">
            <Upload className="w-4 h-4" />
            Ajouter des documents
          </Button>
        </div>

        {/* Documents panel */}
        {showDocs && (
          <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/50 space-y-2 max-h-48 overflow-y-auto">
            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                Aucun document. Uploadez des fichiers pour alimenter l'IA.
              </p>
            ) : (
              documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between text-sm p-2 bg-background/50 rounded-md">
                  <div className="flex items-center gap-2 min-w-0">
                    {statusIcon(doc.status)}
                    <span className="truncate font-medium">{doc.name}</span>
                    <span className="text-xs text-muted-foreground uppercase">{doc.type}</span>
                    {doc.size_bytes ? <span className="text-xs text-muted-foreground">{formatSize(doc.size_bytes)}</span> : null}
                    {doc.status === 'ready' && doc.chunk_count ? (
                      <span className="text-xs text-muted-foreground">{doc.chunk_count} chunks</span>
                    ) : null}
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteDoc(doc.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-4 mt-2 grid grid-cols-2 w-fit">
          <TabsTrigger value="ai" className="gap-1">
            <Bot className="w-3 h-3" /> Chat IA
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-1">
            <Users className="w-3 h-3" /> {t("chat.team")}
          </TabsTrigger>
        </TabsList>

        {/* AI Chat */}
        <TabsContent value="ai" className="flex-1 flex flex-col min-h-0 mt-0">
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.length === 0 && !streamingContent && (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{t("chat.welcome")} {spaceName}</h3>
                  <p className="text-muted-foreground text-sm">
                    {readyDocs.length > 0
                      ? `${readyDocs.length} document(s) chargé(s). Posez votre question !`
                      : "Uploadez des documents pour que l'IA puisse y répondre."}
                  </p>
                  {readyDocs.length === 0 && (
                    <Button variant="outline" onClick={() => setShowUpload(true)} className="gap-2">
                      <Upload className="w-4 h-4" /> Uploader des documents
                    </Button>
                  )}
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-3 animate-fade-in">
                  <Avatar className="w-9 h-9 flex-shrink-0">
                    <AvatarFallback className={msg.role === "user" ? "bg-primary/10" : "bg-gradient-primary text-primary-foreground"}>
                      {msg.role === "user" ? <User className="w-4 h-4 text-primary" /> : <Bot className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 max-w-3xl space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{msg.role === "user" ? (user?.name || "Vous") : "IA"}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-primary/10 border border-primary/20" : "bg-muted/50"}`}>
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-foreground whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                    {msg.sources && Array.isArray(msg.sources) && msg.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2 pl-1">
                        <span className="text-xs text-muted-foreground">Sources:</span>
                        {(msg.sources as any[]).map((s: any, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            <FileText className="w-3 h-3 mr-1" />{s.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {streamingContent && (
                <div className="flex gap-3 animate-fade-in">
                  <Avatar className="w-9 h-9 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 max-w-3xl">
                    <div className="rounded-2xl px-4 py-3 bg-muted/50">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{streamingContent}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isLoading && !streamingContent && (
                <div className="flex gap-3 animate-fade-in">
                  <Avatar className="w-9 h-9 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl px-4 py-3 bg-muted/50">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                      <span className="text-sm">{t("chat.thinking")}</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t border-border p-4 bg-background/95 backdrop-blur-md">
            <div className="max-w-4xl mx-auto flex gap-2 items-end">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, handleSend)}
                placeholder={readyDocs.length > 0 ? "Posez une question sur vos documents..." : "Uploadez des documents d'abord..."}
                disabled={isLoading}
                className="flex-1 min-h-[60px] max-h-[120px] resize-none rounded-2xl"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow h-[60px] px-6"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Team Chat */}
        <TabsContent value="team" className="flex-1 flex flex-col min-h-0 mt-0">
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {teamMessages.length === 0 && (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">{t("chat.teamEmpty")}</h3>
                  <p className="text-muted-foreground text-sm">{t("chat.teamEmptyDesc")}</p>
                </div>
              )}
              {teamMessages.map((msg) => {
                const isMe = msg.user_id === user?.id;
                const name = msg.profile?.display_name || (isMe ? user?.name : "Membre");
                return (
                  <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className={isMe ? "bg-primary/20" : "bg-muted"}>
                        {(name || "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`max-w-[70%] space-y-1 ${isMe ? "items-end" : ""}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className={`rounded-2xl px-4 py-2 ${isMe ? "bg-primary text-primary-foreground" : "bg-muted/50"}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={teamEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t border-border p-4 bg-background/95 backdrop-blur-md">
            <div className="max-w-4xl mx-auto flex gap-2 items-end">
              <Textarea
                value={teamInput}
                onChange={(e) => setTeamInput(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, handleTeamSend)}
                placeholder={t("chat.teamPlaceholder")}
                className="flex-1 min-h-[50px] max-h-[100px] resize-none rounded-2xl"
              />
              <Button
                onClick={handleTeamSend}
                disabled={!teamInput.trim()}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow h-[50px] px-6"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <DocumentUploadModal
        open={showUpload}
        onOpenChange={setShowUpload}
        spaceId={spaceId}
        onUploadComplete={onRefreshDocuments}
      />
    </div>
  );
};
