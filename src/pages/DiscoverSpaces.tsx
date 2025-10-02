import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Users, 
  FileText, 
  Bot, 
  Globe, 
  Lock, 
  Sparkles,
  Target,
  Code,
  Palette,
  TrendingUp,
  BookOpen,
  Microscope,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { spaceStore } from "@/stores/spaceStore";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const categories = [
  { id: 'research', name: 'Recherche', icon: Microscope },
  { id: 'tech', name: 'Technologie', icon: Code },
  { id: 'design', name: 'Design', icon: Palette },
  { id: 'business', name: 'Business', icon: Briefcase },
  { id: 'marketing', name: 'Marketing', icon: TrendingUp },
  { id: 'education', name: 'Éducation', icon: GraduationCap },
  { id: 'docs', name: 'Documentation', icon: BookOpen },
];

// Mock public spaces
const mockPublicSpaces = [
  {
    id: "1",
    name: "AI Research Hub",
    description: "Collaborative space for AI research papers, discussions, and cutting-edge developments in artificial intelligence",
    category: "research",
    tags: ["AI", "ML", "Research"],
    visibility: 'public' as const,
    owner: { name: "Dr. Sarah Chen", avatar: "" },
    stats: { members: 248, documents: 1420, messages: 8924 },
    aiModel: "GPT-5",
    lastActivity: "5 minutes ago",
  },
  {
    id: "2",
    name: "Frontend Dev Community",
    description: "Best practices, code reviews, and discussions about React, Vue, and modern web development",
    category: "tech",
    tags: ["React", "Web Dev", "JavaScript"],
    visibility: 'public' as const,
    owner: { name: "Alex Rodriguez", avatar: "" },
    stats: { members: 892, documents: 567, messages: 15234 },
    aiModel: "Claude Sonnet-4",
    lastActivity: "2 minutes ago",
  },
  {
    id: "3",
    name: "UX Design Patterns",
    description: "Curated collection of UX patterns, case studies, and design system resources for modern interfaces",
    category: "design",
    tags: ["UX", "UI", "Design Systems"],
    visibility: 'public' as const,
    owner: { name: "Emma Thompson", avatar: "" },
    stats: { members: 456, documents: 234, messages: 5678 },
    aiModel: "GPT-4",
    lastActivity: "15 minutes ago",
  },
  {
    id: "4",
    name: "Product Strategy Hub",
    description: "Strategic planning, market analysis, and product roadmap discussions for product managers",
    category: "business",
    tags: ["Strategy", "Product", "Planning"],
    visibility: 'public' as const,
    owner: { name: "Michael Chen", avatar: "" },
    stats: { members: 324, documents: 892, messages: 4521 },
    aiModel: "GPT-5",
    lastActivity: "30 minutes ago",
  },
  {
    id: "5",
    name: "Growth Marketing Lab",
    description: "Data-driven growth strategies, A/B testing results, and marketing automation best practices",
    category: "marketing",
    tags: ["Growth", "Marketing", "Analytics"],
    visibility: 'public' as const,
    owner: { name: "Lisa Wang", avatar: "" },
    stats: { members: 567, documents: 445, messages: 7834 },
    aiModel: "Claude Sonnet-4",
    lastActivity: "1 hour ago",
  },
  {
    id: "6",
    name: "Data Science Learning",
    description: "Educational resources, tutorials, and projects for aspiring data scientists and ML engineers",
    category: "education",
    tags: ["Data Science", "Learning", "Python"],
    visibility: 'public' as const,
    owner: { name: "Prof. David Kim", avatar: "" },
    stats: { members: 1234, documents: 789, messages: 12453 },
    aiModel: "GPT-4",
    lastActivity: "45 minutes ago",
  },
];

interface DiscoverSpacesProps {
  onJoinClick?: () => void;
}

export default function DiscoverSpaces({ onJoinClick }: DiscoverSpacesProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [spaces, setSpaces] = useState<typeof mockPublicSpaces>(mockPublicSpaces);

  useEffect(() => {
    // Load public spaces from store
    const publicSpaces = spaceStore.getPublicSpaces();
    if (publicSpaces.length > 0) {
      setSpaces(publicSpaces as any);
    }
  }, []);

  const filteredSpaces = spaces.filter(space => {
    const matchesSearch = !searchQuery || 
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || space.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleJoinSpace = (spaceId: string) => {
    if (!isAuthenticated) {
      onJoinClick?.();
      return;
    }
    
    navigate(`/spaces/join/${spaceId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-hero py-16 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8">
            <Badge variant="secondary" className="mb-2 bg-white/20 text-white border-white/30">
              <Globe className="w-3 h-3 mr-1" />
              Explorer les Espaces Publics
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Rejoignez des Espaces de Collaboration
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Découvrez des espaces de travail collaboratifs alimentés par l'IA pour la recherche, l'analyse et le partage de connaissances
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
            <Input
              type="search"
              placeholder="Rechercher des spaces par nom, catégorie, ou tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/15 focus:border-white/40 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedCategory === null ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-gradient-primary shrink-0" : "shrink-0"}
            >
              <Target className="w-4 h-4 mr-2" />
              Tous
            </Button>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "bg-gradient-primary shrink-0" : "shrink-0"}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spaces Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {filteredSpaces.length} Space{filteredSpaces.length > 1 ? 's' : ''} disponible{filteredSpaces.length > 1 ? 's' : ''}
            </h2>
            <p className="text-muted-foreground">
              {selectedCategory ? `Catégorie: ${categories.find(c => c.id === selectedCategory)?.name}` : 'Toutes les catégories'}
            </p>
          </div>
        </div>

        {filteredSpaces.length === 0 ? (
          <Card className="max-w-lg mx-auto shadow-elegant border-border/50 bg-gradient-card">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Aucun space trouvé
              </h3>
              <p className="text-muted-foreground mb-4">
                Essayez d'ajuster vos filtres ou votre recherche
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSpaces.map((space) => (
              <Card key={space.id} className="shadow-elegant border-border/50 hover:shadow-glow transition-all duration-300 bg-gradient-card">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-glow">
                      {space.name.charAt(0)}
                    </div>
                    <Badge variant={space.visibility === 'public' ? 'default' : 'secondary'} className="text-xs">
                      {space.visibility === 'public' ? (
                        <>
                          <Globe className="w-3 h-3 mr-1" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 mr-1" />
                          Privé
                        </>
                      )}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-1">{space.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{space.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {space.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{space.stats.members}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>{space.stats.documents}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      <span>{space.aiModel}</span>
                    </div>
                  </div>

                  {/* Owner */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-muted">
                        {space.owner.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{space.owner.name}</span>
                  </div>

                  {/* Join Button */}
                  <Button 
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    onClick={() => handleJoinSpace(space.id)}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Rejoindre le Space
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
