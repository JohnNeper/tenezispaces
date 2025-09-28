import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Globe, 
  Lock, 
  Users, 
  MessageSquare, 
  Clock, 
  Settings, 
  ArrowRight,
  Crown,
  Share,
  MoreVertical
} from "lucide-react";
import { SpaceSettings } from "./SpaceSettings";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

interface FunctionalSpaceCardProps {
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
}

export const FunctionalSpaceCard = ({ space }: FunctionalSpaceCardProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const { t } = useLanguage();

  const handleSpaceClick = () => {
    // Navigate to space chat
    window.location.href = `/spaces/${space.id}/chat`;
  };

  return (
    <>
      <Card className="border border-border/50 hover:shadow-card transition-all group cursor-pointer bg-gradient-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3 flex-1" onClick={handleSpaceClick}>
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                {space.visibility === "private" ? (
                  <Lock className="w-6 h-6 text-primary-foreground" />
                ) : (
                  <Globe className="w-6 h-6 text-primary-foreground" />
                )}
              </div>
              
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {space.name}
                  </h3>
                  {space.isOwner && (
                    <Crown className="w-4 h-4 text-warning flex-shrink-0" />
                  )}
                  <Badge variant={space.visibility === "private" ? "secondary" : "outline"} className="flex-shrink-0">
                    {space.visibility === "private" ? "Privé" : "Public"}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {space.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {space.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {space.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{space.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowSettings(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="w-4 h-4 mr-2" />
                  Partager
                </DropdownMenuItem>
                <Link to={`/spaces/${space.id}/chat`}>
                  <DropdownMenuItem>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Ouvrir
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{space.stats.members} {t("dashboard.members")}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-3 h-3" />
                <span>{space.stats.messages} {t("dashboard.messages")}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{space.lastActivity}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {space.aiModel}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {space.category}
                </Badge>
              </div>
              
              <Button 
                size="sm" 
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                onClick={handleSpaceClick}
              >
                <ArrowRight className="w-4 h-4 mr-1" />
                Ouvrir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <SpaceSettings 
            space={space} 
            onClose={() => setShowSettings(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};