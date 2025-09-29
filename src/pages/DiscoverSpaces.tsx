import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  ArrowLeft,
  Users,
  FileText,
  MessageSquare,
  Globe,
  BookOpen,
  Calculator,
  Microscope,
  Palette,
  Code,
  TrendingUp,
  Bot,
  Clock
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { spaceStore, type Space } from "@/stores/spaceStore";
import workspaceBg from "@/assets/workspace-bg.jpg";

const categories = [
  { id: "all", name: "All Categories", icon: Globe },
  { id: "education", name: "Education", icon: BookOpen },
  { id: "mathematics", name: "Mathematics", icon: Calculator },
  { id: "research", name: "Research", icon: Microscope },
  { id: "design", name: "Design", icon: Palette },
  { id: "programming", name: "Programming", icon: Code },
  { id: "business", name: "Business", icon: TrendingUp },
];

const mockPublicSpaces = [
  {
    id: "1",
    name: "Advanced Mathematics Study Group",
    description: "Collaborative space for studying advanced calculus, linear algebra, and mathematical proofs. Join students and professors sharing knowledge and solving complex problems together.",
    category: "mathematics",
    tags: ["Calculus", "Linear Algebra", "Proofs"],
    owner: { name: "Prof. Sarah Chen", avatar: "" },
    stats: { members: 45, documents: 89, messages: 1250 },
    isJoined: false,
    aiModel: "GPT-5",
    lastActivity: "5 minutes ago",
  },
  {
    id: "2",
    name: "Machine Learning Research Hub",
    description: "Latest research papers, datasets, and discussions about machine learning, deep learning, and AI. Perfect for researchers, PhD students, and industry professionals.",
    category: "research",
    tags: ["ML", "Deep Learning", "Research Papers"],
    owner: { name: "Dr. Alex Rodriguez", avatar: "" },
    stats: { members: 128, documents: 156, messages: 2890 },
    isJoined: false,
    aiModel: "Claude Sonnet-4",
    lastActivity: "12 minutes ago",
  },
  {
    id: "3",
    name: "UX Design Collective",
    description: "Share design patterns, user research findings, and collaborate on UX projects. A community for designers to learn and grow together.",
    category: "design",
    tags: ["UX", "Design Patterns", "User Research"],
    owner: { name: "Emma Thompson", avatar: "" },
    stats: { members: 67, documents: 234, messages: 1567 },
    isJoined: true,
    aiModel: "GPT-5",
    lastActivity: "1 hour ago",
  },
  {
    id: "4",
    name: "Open Source Development",
    description: "Collaborate on open source projects, share code snippets, and discuss best practices in software development.",
    category: "programming",
    tags: ["Open Source", "JavaScript", "Python"],
    owner: { name: "David Kim", avatar: "" },
    stats: { members: 89, documents: 78, messages: 945 },
    isJoined: false,
    aiModel: "Claude Sonnet-4",
    lastActivity: "2 hours ago",
  },
  {
    id: "5",
    name: "Business Strategy & Analytics",
    description: "Analyze market trends, share business cases, and develop strategic insights for modern businesses.",
    category: "business",
    tags: ["Strategy", "Analytics", "Market Research"],
    owner: { name: "Maria Garcia", avatar: "" },
    stats: { members: 34, documents: 67, messages: 456 },
    isJoined: false,
    aiModel: "GPT-5",
    lastActivity: "4 hours ago",
  },
];

export default function DiscoverSpaces() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [filteredSpaces, setFilteredSpaces] = useState<Space[]>([]);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Charger les spaces publics depuis le store
    const publicSpaces = spaceStore.getPublicSpaces();
    setSpaces(publicSpaces);
    setFilteredSpaces(publicSpaces);
  }, []);

  useEffect(() => {
    // Filtrer les spaces selon les critères
    let filtered = spaces.filter(space => {
      const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           space.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           space.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || space.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredSpaces(filtered);
  }, [searchQuery, selectedCategory, spaces]);

  const handleJoinSpace = (spaceId: string) => {
    if (!user) return;
    
    const space = spaceStore.getSpaceById(spaceId);
    if (!space) return;
    
    // Vérifier si l'utilisateur est déjà membre
    const isAlreadyMember = space.members.some(member => member.id === user.id);
    if (isAlreadyMember) {
      navigate(`/spaces/${spaceId}`);
      return;
    }
    
    const success = spaceStore.joinSpace(spaceId, user.id, user.name);
    if (success) {
      toast({
        title: t("join.success"),
        description: t("join.welcomeToSpace", { spaceName: space.name }),
      });
      // Recharger les spaces pour refléter les changements
      const updatedSpaces = spaceStore.getPublicSpaces();
      setSpaces(updatedSpaces);
      navigate(`/spaces/${spaceId}`);
    }
  };

  const isUserMember = (space: Space) => {
    return user && space.members.some(member => member.id === user.id);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("spaces.discoverPublic")}</h1>
              <p className="text-muted-foreground">
                {t("spaces.explorePublic")}
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("spaces.searchPublic")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border/50 focus:border-primary"
              />
            </div>
            
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              {t("spaces.filter")}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t("spaces.browseCategories")}</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filteredSpaces.length === 0 ? (
            <Card className="border-border/50 bg-gradient-card">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t("spaces.noSpacesFound")}
                </h3>
                <p className="text-muted-foreground">
                  {t("spaces.tryAdjusting")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpaces.map((space, index) => (
                <Card 
                  key={space.id} 
                  className="border-border/50 bg-gradient-card group hover:shadow-glow transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-glow">
                        {space.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {space.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {space.owner.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{space.owner.name}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {space.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {space.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{space.stats.members}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>{space.stats.documents}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{space.stats.messages}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Bot className="w-3 h-3" />
                        {space.aiModel}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {space.lastActivity.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <Button 
                      className={`w-full ${
                        isUserMember(space) 
                          ? 'bg-muted text-muted-foreground' 
                          : 'bg-gradient-primary hover:shadow-glow'
                      } transition-all duration-300`}
                      disabled={isUserMember(space)}
                      onClick={() => handleJoinSpace(space.id)}
                    >
                      {isUserMember(space) ? t("spaces.joined") : t("spaces.joinSpace")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}