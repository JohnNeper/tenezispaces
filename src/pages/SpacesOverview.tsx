import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Filter, 
  Grid3X3, 
  List, 
  TrendingUp,
  Users,
  Globe,
  Lock,
  Sparkles
} from "lucide-react";
import { SpaceCard } from "@/components/SpaceCard";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

const mockSpaces = [
  {
    id: "1",
    name: "Product Research Hub",
    description: "Central repository for all product research documents, user feedback, and market analysis. This space contains valuable insights from customer interviews, usability tests, and competitive analysis.",
    category: "Research",
    tags: ["UX Research", "Market Analysis", "User Feedback"],
    visibility: 'public' as const,
    owner: { name: "Sarah Chen", avatar: "" },
    stats: { members: 12, documents: 24, messages: 156 },
    aiModel: "GPT-5",
    lastActivity: "2 hours ago",
    isOwner: true,
  },
  {
    id: "2", 
    name: "Engineering Docs",
    description: "Technical documentation, API references, and development guidelines for the engineering team.",
    category: "Engineering",
    tags: ["API", "Technical", "Guidelines"],
    visibility: 'private' as const,
    owner: { name: "Alex Rodriguez", avatar: "" },
    stats: { members: 8, documents: 45, messages: 89 },
    aiModel: "Claude Sonnet-4",
    lastActivity: "1 day ago",
    isOwner: false,
  },
  {
    id: "3",
    name: "Marketing Materials",
    description: "Brand guidelines, marketing copy, campaign materials and performance analytics.",
    category: "Marketing", 
    tags: ["Brand", "Campaigns", "Analytics"],
    visibility: 'public' as const,
    owner: { name: "Emma Thompson", avatar: "" },
    stats: { members: 15, documents: 67, messages: 203 },
    aiModel: "GPT-5",
    lastActivity: "3 hours ago",
    isOwner: false,
  },
];

export default function SpacesOverview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { t } = useLanguage();

  const filteredSpaces = mockSpaces.filter(space =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("nav.spaces")}</h1>
              <p className="text-muted-foreground">
                {t("spaces.manageWorkspaces")}
              </p>
            </div>
            
            <Link to="/spaces/create">
              <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                {t("spaces.create")}
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("spaces.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border/50 focus:border-primary"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                {t("spaces.filter")}
              </Button>
              
              <div className="flex border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-md"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-md"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-sm text-muted-foreground">{t("spaces.totalSpaces")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">8</p>
                  <p className="text-sm text-muted-foreground">{t("spaces.publicCount")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-sm text-muted-foreground">{t("spaces.privateCount")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">1.2k</p>
                  <p className="text-sm text-muted-foreground">{t("spaces.totalMessages")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spaces Tabs */}
        <Tabs defaultValue="my-spaces" className="space-y-6">
          <TabsList className="bg-muted/30">
            <TabsTrigger value="my-spaces" className="gap-2">
              <Users className="w-4 h-4" />
              {t("spaces.mySpaces")}
            </TabsTrigger>
            <TabsTrigger value="public" className="gap-2">
              <Globe className="w-4 h-4" />
              {t("spaces.discoverPublic")}
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              {t("spaces.recentActivity")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-spaces">
            {filteredSpaces.length === 0 ? (
              <Card className="border-border/50 bg-gradient-card">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {searchQuery ? t("spaces.noSpacesFound") : t("spaces.noSpacesYet")}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? t("spaces.tryAdjusting")
                      : t("spaces.createFirst")
                    }
                  </p>
                  {!searchQuery && (
                    <Link to="/spaces/create">
                      <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                        <Plus className="w-4 h-4 mr-2" />
                        {t("spaces.create")}
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredSpaces.map((space, index) => (
                  <div 
                    key={space.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <SpaceCard space={space} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="public">
            <Card className="border-border/50 bg-gradient-card">
              <CardHeader>
                <CardTitle>{t("spaces.discoverPublic")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("spaces.explorePublic")}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent">
            <Card className="border-border/50 bg-gradient-card">
              <CardHeader>
                <CardTitle>{t("spaces.recentActivity")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("spaces.recentInteractions")}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}