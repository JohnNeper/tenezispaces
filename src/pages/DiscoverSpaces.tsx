import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, Users, FileText, Bot, Globe, Sparkles, Target,
  Code, Palette, TrendingUp, BookOpen, Microscope, Briefcase, GraduationCap, Loader2
} from "lucide-react";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSpaces, type SpaceData } from "@/hooks/useSpaces";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";

const categories = [
  { id: 'research', name: { fr: 'Recherche', en: 'Research' }, icon: Microscope },
  { id: 'engineering', name: { fr: 'Technologie', en: 'Technology' }, icon: Code },
  { id: 'design', name: { fr: 'Design', en: 'Design' }, icon: Palette },
  { id: 'marketing', name: { fr: 'Marketing', en: 'Marketing' }, icon: TrendingUp },
  { id: 'education', name: { fr: 'Éducation', en: 'Education' }, icon: GraduationCap },
  { id: 'other', name: { fr: 'Autre', en: 'Other' }, icon: BookOpen },
];

interface DiscoverSpacesProps {
  onJoinClick?: () => void;
}

export default function DiscoverSpaces({ onJoinClick }: DiscoverSpacesProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { joinSpace } = useSpaces();
  const { t, currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [publicSpaces, setPublicSpaces] = useState<SpaceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicSpaces = async () => {
      const { data } = await supabase
        .from('spaces')
        .select('*')
        .eq('visibility', 'public')
        .order('updated_at', { ascending: false });
      setPublicSpaces((data as SpaceData[]) || []);
      setLoading(false);
    };
    fetchPublicSpaces();
  }, []);

  const filteredSpaces = publicSpaces.filter(space => {
    const matchesSearch = !searchQuery || 
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (space.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (space.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || space.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoinSpace = async (spaceId: string) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', `/spaces/${spaceId}`);
      onJoinClick?.();
      return;
    }
    
    try {
      await joinSpace(spaceId);
      navigate(`/spaces/${spaceId}`);
      toast.success(t("spaces.joinSuccess") || "Espace rejoint !");
    } catch (error: any) {
      // If already member, just navigate
      if (error?.message?.includes('duplicate')) {
        navigate(`/spaces/${spaceId}`);
      } else {
        toast.error("Erreur lors de la jonction");
      }
    }
  };

  const getSpaceColor = (name: string) => {
    const colors = [
      'from-blue-500 to-blue-600', 'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600', 'from-green-500 to-green-600',
      'from-yellow-500 to-yellow-600', 'from-red-500 to-red-600',
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-hero py-16 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8">
            <Badge variant="secondary" className="mb-2 bg-white/20 text-white border-white/30">
              <Globe className="w-3 h-3 mr-1" />
              {t("discover.explorePublic")}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {t("discover.joinSpaces")}
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              {t("discover.description")}
            </p>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
            <Input
              type="search"
              placeholder={t("discover.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/15 focus:border-white/40 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="bg-background/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-foreground mb-1">
              {loading ? "..." : `${filteredSpaces.length} ${t("discover.spacesAvailable")}`}
            </h2>
          </div>
          
          <Carousel opts={{ align: "center", loop: true }} className="w-full max-w-4xl mx-auto">
            <CarouselContent className="-ml-2 md:-ml-4">
              <CarouselItem className="pl-2 md:pl-4 basis-auto">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedCategory(null)}
                  className={selectedCategory === null ? "bg-gradient-primary shadow-glow" : ""}
                >
                  <Target className="w-4 h-4 mr-2" />
                  {t("discover.all")}
                </Button>
              </CarouselItem>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-auto">
                    <Button
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="lg"
                      onClick={() => setSelectedCategory(category.id)}
                      className={selectedCategory === category.id ? "bg-gradient-primary shadow-glow" : ""}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.name[currentLanguage.code as 'fr' | 'en'] || category.name.en}
                    </Button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>

      {/* Spaces */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t("discover.featuredSpaces")}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredSpaces.length === 0 ? (
          <Card className="max-w-lg mx-auto shadow-elegant border-border/50 bg-gradient-card">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {t("discover.noSpaces")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("discover.tryAdjusting")}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => (
              <Card key={space.id} className="group shadow-elegant border-border/50 hover:shadow-glow transition-all duration-300 bg-gradient-card overflow-hidden h-full">
                <CardHeader>
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getSpaceColor(space.name)} rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-glow border-2 border-primary/20 flex-shrink-0`}>
                      {space.image_url ? (
                        <img src={space.image_url} alt="" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        space.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-1 mb-1">{space.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        <Bot className="w-3 h-3 mr-1" />
                        {space.ai_model || 'IA'}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">{space.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(space.tags || []).slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>

                  <Badge variant="outline" className="text-xs">{space.category}</Badge>

                  <Button 
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    onClick={() => handleJoinSpace(space.id)}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t("discover.joinSpace")}
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
