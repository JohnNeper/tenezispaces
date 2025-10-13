import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  FileText, 
  Clock,
  RotateCcw,
  Eye,
  MessageSquare
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { DocumentPreview } from "./DocumentPreview";
import { chatService, type ChatMessage } from "@/services/chatService";
import { spaceStore, type Space } from "@/stores/spaceStore";

// Utilise le type des messages du store
type Message = Space['messages'][0];

interface SpaceChatProps {
  spaceId: string;
  spaceName: string;
  aiModel: string;
  documents: Array<{ id: string; name: string; type: string }>;
}

export const SpaceChat = ({ spaceId, spaceName, aiModel, documents }: SpaceChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(aiModel);
  const [isLoading, setIsLoading] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { toast } = useToast();

  const aiModels = [
    { id: "GPT-5", name: "GPT-5" },
    { id: "Claude Sonnet-4", name: "Claude Sonnet-4" },
    { id: "GPT-4", name: "GPT-4" },
    { id: "Gemini Pro", name: "Gemini Pro" },
  ];

  // Mettre à jour les messages existants avec le spaceStore
  useEffect(() => {
    if (spaceId) {
      const history = spaceStore.getMessages(spaceId);
      setMessages(history);
    }
  }, [spaceId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);

    // Ajouter le message utilisateur au store
    const userId = localStorage.getItem('tenezis_user') ? JSON.parse(localStorage.getItem('tenezis_user')!).id : '1';
    
    spaceStore.addMessage(spaceId, {
      content: currentInput,
      type: 'user',
      userId: userId
    });

    // Mettre à jour l'état local immédiatement
    const updatedMessages = spaceStore.getMessages(spaceId);
    setMessages([...updatedMessages]);

    try {
      const response = await chatService.sendMessage(spaceId, currentInput, selectedModel);
      
      // Ajouter la réponse IA au store
      spaceStore.addMessage(spaceId, {
        content: response.message,
        type: 'ai',
        userId: 'ai',
        sources: response.sources
      });

      // Mettre à jour l'état local avec tous les messages
      const finalMessages = spaceStore.getMessages(spaceId);
      setMessages([...finalMessages]);
      
      toast({
        title: t("chat.responseGenerated"),
        description: t("chat.aiAnalyzed"),
      });
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Erreur",
        description: t("chat.error"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewConversation = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
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
                  {selectedModel}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  {documents.length} {t("chat.documents")}
                </Badge>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={startNewConversation}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {t("chat.new")}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <Card className="border-border/50 bg-gradient-card">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {t("chat.welcome")} {spaceName}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("chat.startConversation")}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {messages.map((message) => (
            <div key={message.id} className="flex gap-3 animate-fade-in">
              <Avatar className="w-9 h-9 flex-shrink-0">
                {message.type === 'user' ? (
                  <AvatarFallback className="bg-primary/10">
                    <User className="w-4 h-4 text-primary" />
                  </AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex-1 space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {message.type === 'user' ? t("dashboard.you") : selectedModel}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {typeof message.timestamp === 'string' ? message.timestamp : message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user' 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'bg-muted/50'
                }`}>
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
                
                {message.sources && (
                  <div className="space-y-2 pl-1">
                    <span className="text-xs font-medium text-muted-foreground">{t("chat.sources")}</span>
                    <div className="flex flex-wrap gap-2">
                      {message.sources.map((source) => (
                        <Badge 
                          key={source.name} 
                          variant="outline" 
                          className="text-xs cursor-pointer hover:bg-muted/50 transition-colors group"
                          onClick={() => {
                            const doc = documents.find(d => d.name === source.name);
                            if (doc) {
                              setPreviewDocument({
                                ...doc,
                                size: "2.3 MB"
                              });
                            }
                          }}
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          {source.name}
                          <Eye className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <Avatar className="w-9 h-9 flex-shrink-0">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 max-w-3xl">
                <div className="rounded-2xl px-4 py-3 bg-muted/50">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    <span className="text-sm">{t("chat.thinking")}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4 bg-background/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aiModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center gap-2">
                      <Bot className="w-3 h-3" />
                      {model.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t("chat.placeholder")}
              disabled={isLoading}
              className="flex-1 min-h-[60px] max-h-[120px] resize-none rounded-2xl"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 h-[60px] px-6"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDocument && (
        <DocumentPreview
          document={previewDocument}
          onClose={() => setPreviewDocument(null)}
        />
      )}
    </div>
  );
};