import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Settings, 
  Share2, 
  Users, 
  FileText, 
  Bot, 
  Upload,
  MoreHorizontal,
  MessageSquare,
  Zap
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { SpaceChat } from "@/components/SpaceChat";
import { SpaceSettings } from "@/components/SpaceSettings";
import { useLanguage } from "@/hooks/useLanguage";

const mockSpace = {
  id: "1",
  name: "Product Research Hub",
  description: "Central repository for all product research documents, user feedback, and market analysis.",
  category: "Research",
  tags: ["UX Research", "Market Analysis", "User Feedback"],
  visibility: 'public' as const,
  owner: { name: "Sarah Chen", avatar: "" },
  stats: { members: 12, documents: 24, messages: 156 },
  aiModel: "gpt-4",
  lastActivity: "2 hours ago",
  isOwner: true,
};

const mockDocuments = [
  { id: "1", name: "User Interview Transcripts Q4 2024.pdf", type: "PDF", size: "2.3 MB", uploadedAt: "2024-01-15" },
  { id: "2", name: "Market Research Report.docx", type: "DOCX", size: "5.1 MB", uploadedAt: "2024-01-14" },
  { id: "3", name: "Competitor Analysis Spreadsheet.xlsx", type: "XLSX", size: "1.8 MB", uploadedAt: "2024-01-13" },
  { id: "4", name: "Product Requirements Document.pdf", type: "PDF", size: "4.2 MB", uploadedAt: "2024-01-12" },
  { id: "5", name: "Customer Feedback Survey Results.csv", type: "CSV", size: "892 KB", uploadedAt: "2024-01-11" },
];

const mockMembers = [
  { id: "1", name: "Sarah Chen", role: "Owner", avatar: "", lastActive: "Online" },
  { id: "2", name: "Alex Rodriguez", role: "Collaborator", avatar: "", lastActive: "2 hours ago" },
  { id: "3", name: "Emma Thompson", role: "User", avatar: "", lastActive: "1 day ago" },
  { id: "4", name: "David Kim", role: "User", avatar: "", lastActive: "3 days ago" },
];

export default function SpaceChatPage() {
  const { spaceId } = useParams();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("chat");
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-subtle flex">
      {/* Sidebar */}
      <div className="w-80 bg-background/80 backdrop-blur-md border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <Link to="/spaces" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>{t("spaces.backToSpaces")}</span>
          </Link>
          
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-glow">
              {mockSpace.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground truncate">{mockSpace.name}</h2>
              <p className="text-sm text-muted-foreground line-clamp-2">{mockSpace.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  <Bot className="w-3 h-3 mr-1" />
                  {mockSpace.aiModel}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {mockSpace.category}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1">
                  <Settings className="w-4 h-4 mr-2" />
                  {t("chat.settings")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Paramètres de l'espace</DialogTitle>
                </DialogHeader>
                <SpaceSettings 
                  space={mockSpace} 
                  onClose={() => setShowSettings(false)} 
                />
              </DialogContent>
            </Dialog>
            <Button size="sm" variant="outline">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3 bg-muted/30 m-4">
            <TabsTrigger value="chat" className="gap-2 text-xs">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="docs" className="gap-2 text-xs">
              <FileText className="w-4 h-4" />
              {t("chat.documents")}
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2 text-xs">
              <Users className="w-4 h-4" />
              {t("chat.team")}
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 px-4 pb-4">
            <TabsContent value="chat" className="h-full mt-0">
              <Card className="h-full border-border/50 bg-gradient-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{t("chat.recentConversations")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    {t("chat.chatHistory")}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="docs" className="h-full mt-0">
              <Card className="h-full border-border/50 bg-gradient-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{t("chat.documents")} ({mockDocuments.length})</CardTitle>
                    <Link to="/documents/upload">
                      <Button size="sm" variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        {t("chat.add")}
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 overflow-auto">
                  {mockDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members" className="h-full mt-0">
              <Card className="h-full border-border/50 bg-gradient-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{t("chat.members")} ({mockMembers.length})</CardTitle>
                    <Button size="sm" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      {t("chat.invite")}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 overflow-auto">
                  {mockMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {member.role}
                          </Badge>
                          <span>{member.lastActive}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <SpaceChat
          spaceId={mockSpace.id}
          spaceName={mockSpace.name}
          aiModel={mockSpace.aiModel}
          documents={mockDocuments}
        />
      </div>
    </div>
  );
}