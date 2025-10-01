import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Settings, 
  Share2, 
  Users, 
  FileText, 
  Bot,
  Upload,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SpaceSettings } from "@/components/SpaceSettings";
import { useLanguage } from "@/hooks/useLanguage";

interface SpaceDetailsSidebarProps {
  space: {
    id: string;
    name: string;
    description: string;
    category: string;
    tags: string[];
    visibility: 'public' | 'private';
    owner: { name: string; avatar: string };
    stats: { members: number; documents: number; messages: number };
    aiModel: string;
    lastActivity: string;
    isOwner: boolean;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedAt: string;
  }>;
  members: Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
    lastActive: string;
  }>;
  onShare: () => void;
}

export const SpaceDetailsSidebar = ({ space, documents, members, onShare }: SpaceDetailsSidebarProps) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("info");
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="w-80 bg-background/95 backdrop-blur-md border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-glow">
            {space.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground truncate">{space.name}</h2>
            <p className="text-xs text-muted-foreground line-clamp-2">{space.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                <Bot className="w-3 h-3 mr-1" />
                {space.aiModel}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {space.category}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                {t("chat.settings")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>{t("chat.spaceSettings")}</DialogTitle>
              </DialogHeader>
              <SpaceSettings 
                space={space} 
                onClose={() => setShowSettings(false)} 
              />
            </DialogContent>
          </Dialog>
          <Button size="sm" variant="outline" onClick={onShare}>
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 bg-muted/30 mx-4 mt-4">
          <TabsTrigger value="info" className="gap-2 text-xs">
            <MessageSquare className="w-4 h-4" />
            Info
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

        <div className="flex-1 px-4 pb-4 overflow-hidden">
          <TabsContent value="info" className="h-full mt-4">
            <Card className="h-full border-border/50 bg-gradient-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{t("spaces.spaceInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("spaces.category")}</p>
                  <Badge variant="secondary">{space.category}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("spaces.tags")}</p>
                  <div className="flex flex-wrap gap-1">
                    {space.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("spaces.visibility")}</p>
                  <Badge variant={space.visibility === 'public' ? 'default' : 'secondary'}>
                    {space.visibility === 'public' ? t("spaces.public") : t("spaces.private")}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("spaces.lastActivity")}</p>
                  <p className="text-sm text-foreground">{space.lastActivity}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="h-full mt-4">
            <Card className="h-full border-border/50 bg-gradient-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{t("chat.documents")} ({documents.length})</CardTitle>
                  <Link to="/documents/upload">
                    <Button size="sm" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      {t("chat.add")}
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 overflow-auto max-h-[calc(100%-80px)]">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
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

          <TabsContent value="members" className="h-full mt-4">
            <Card className="h-full border-border/50 bg-gradient-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{t("chat.members")} ({members.length})</CardTitle>
                  <Button size="sm" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    {t("chat.invite")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 overflow-auto max-h-[calc(100%-80px)]">
                {members.map((member) => (
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
  );
};
