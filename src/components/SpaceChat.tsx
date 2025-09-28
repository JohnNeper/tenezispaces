import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  FileText, 
  Clock,
  RotateCcw
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  sources?: { name: string; type: string }[];
}

interface SpaceChatProps {
  spaceId: string;
  spaceName: string;
  aiModel: string;
  documents: Array<{ id: string; name: string; type: string }>;
}

export const SpaceChat = ({ spaceId, spaceName, aiModel, documents }: SpaceChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `Based on the documents in "${spaceName}", I can help you with that. This is a simulated response using ${aiModel}. The information comes from your uploaded documents including ${documents.slice(0, 2).map(d => d.name).join(', ')} and others.`,
          type: 'ai',
          timestamp: new Date(),
          sources: documents.slice(0, 3),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
        
        toast({
          title: t("chat.responseGenerated"),
          description: t("chat.aiAnalyzed"),
        });
      }, 2000);
    } catch (error) {
        toast({
          title: "Erreur",
          description: t("chat.error"),
          variant: "destructive"
        });
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
      <div className="border-b border-border p-4 bg-background/80 backdrop-blur-md">
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
                  {aiModel}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  {documents.length} docs
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
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.length === 0 && (
            <Card className="border-border/50 bg-gradient-card">
              <CardContent className="p-6 text-center space-y-4">
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
              <Avatar className="w-8 h-8 flex-shrink-0">
                {message.type === 'user' ? (
                  <>
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              
              <div className="flex-1 space-y-2">
                 <div className="flex items-center gap-2">
                   <span className="text-sm font-medium text-foreground">
                     {message.type === 'user' ? 'Vous' : aiModel}
                   </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <Card className={`${
                  message.type === 'user' 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-muted/30 border-border/50'
                }`}>
                  <CardContent className="p-3">
                    <p className="text-foreground whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </CardContent>
                </Card>
                
                {message.sources && (
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">{t("chat.sources")}</span>
                    <div className="flex flex-wrap gap-2">
                      {message.sources.map((source) => (
                        <Badge 
                          key={source.name} 
                          variant="outline" 
                          className="text-xs cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          {source.name}
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
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Card className="bg-muted/30 border-border/50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      <span className="text-sm">{t("chat.thinking")}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4 bg-background/80 backdrop-blur-md">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t("chat.placeholder")}
            disabled={isLoading}
            className="flex-1 border-border/50 focus:border-primary"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};