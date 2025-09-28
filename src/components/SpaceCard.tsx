import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Globe, 
  Lock, 
  MoreVertical,
  Settings,
  Share2,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface SpaceCardProps {
  space: {
    id: string;
    name: string;
    description: string;
    category: string;
    tags: string[];
    visibility: 'public' | 'private';
    owner: {
      name: string;
      avatar?: string;
    };
    stats: {
      members: number;
      documents: number;
      messages: number;
    };
    aiModel: string;
    lastActivity: string;
    isOwner?: boolean;
  };
}

export const SpaceCard = ({ space }: SpaceCardProps) => {
  return (
    <Card className="group hover:shadow-card transition-all duration-300 border-border/50 bg-gradient-card animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-glow">
              {space.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-lg">{space.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {space.visibility === 'public' ? (
                  <Globe className="w-4 h-4 text-success" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">
                  {space.visibility === 'public' ? 'Public' : 'Private'}
                </span>
              </div>
            </div>
          </div>
          
          {space.isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="line-clamp-2">
          {space.description}
        </CardDescription>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {space.category}
          </Badge>
          {space.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {space.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{space.tags.length - 2}
            </Badge>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{space.stats.members}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{space.stats.documents}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{space.stats.messages}</span>
            </div>
          </div>
        </div>
        
        {/* Owner */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={space.owner.avatar} />
              <AvatarFallback className="text-xs">
                {space.owner.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {space.owner.name}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {space.lastActivity}
          </span>
        </div>
        
        {/* Action */}
        <Link to={`/spaces/${space.id}/chat`}>
          <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300">
            <MessageSquare className="w-4 h-4 mr-2" />
            Open Space
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};