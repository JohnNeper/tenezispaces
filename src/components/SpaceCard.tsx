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
import spaceDefaultImage from "@/assets/space-default.jpg";

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
  // Generate a consistent color based on space name
  const getSpaceColor = (name: string) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-green-500 to-green-600',
      'from-yellow-500 to-yellow-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Check if there's a space image URL
  const spaceImageUrl = (space as any).imageUrl || (space as any).image || spaceDefaultImage;

  return (
    <Card className="group hover:shadow-card transition-all duration-300 border-border/50 bg-gradient-card animate-fade-in overflow-hidden">
      {/* Space Image/Color Header */}
      <div className="relative h-32 overflow-hidden">
        {spaceImageUrl !== spaceDefaultImage ? (
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${spaceImageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getSpaceColor(space.name)}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-white/80">
                {space.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>

      <CardHeader className="pb-4 -mt-8 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-background/95 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-elegant border-2 border-border/50">
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