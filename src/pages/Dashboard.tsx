import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Users, 
  FileText, 
  Bot, 
  Zap,
  Clock,
  ArrowRight,
  Globe,
  Lock,
  Crown,
  TrendingUp,
  MessageSquare,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";
import { UserProfile } from "@/components/UserProfile";
import { LanguageSelector } from "@/components/LanguageSelector";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { FunctionalSpaceCard } from "@/components/FunctionalSpaceCard";
import { CreateSpaceModal } from "@/components/CreateSpaceModal";
import { DocumentUploadModal } from "@/components/DocumentUploadModal";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    categories: [],
    visibility: [],
    roles: [],
    activity: []
  });
  const [createSpaceModalOpen, setCreateSpaceModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Mock data for spaces
  const spaces = [
    {
      id: "1",
      name: "Product Strategy",
      description: "Strategic planning and roadmap discussions",
      category: "Business",
      tags: ["Strategy", "Planning", "Roadmap"],
      visibility: 'private' as const,
      owner: { name: "You", avatar: "" },
      stats: { members: 8, documents: 45, messages: 124 },
      aiModel: "GPT-5",
      lastActivity: "2 hours ago",
      isOwner: true,
    },
    {
      id: "2",
      name: "AI Research Hub",
      description: "Latest developments in AI and machine learning",
      category: "Technology",
      tags: ["AI", "Research", "ML"],
      visibility: 'public' as const,
      owner: { name: "Sarah Chen", avatar: "" },
      stats: { members: 32, documents: 89, messages: 892 },
      aiModel: "Claude Sonnet-4",
      lastActivity: "5 minutes ago",
      isOwner: false,
    },
    {
      id: "3",
      name: "Design System",
      description: "UI/UX guidelines and component library",
      category: "Design",
      tags: ["Design", "UI/UX", "Components"],
      visibility: 'private' as const,
      owner: { name: "Emma Thompson", avatar: "" },
      stats: { members: 12, documents: 67, messages: 67 },
      aiModel: "GPT-5",
      lastActivity: "1 day ago",
      isOwner: false,
    }
  ];

  const recentActivity = [
    {
      space: "AI Research Hub",
      action: t("dashboard.newDocument"),
      time: t("dashboard.minutesAgo"),
      user: "Sarah Chen"
    },
    {
      space: "Product Strategy", 
      action: t("dashboard.messageSent"),
      time: t("dashboard.hoursAgo"),
      user: t("dashboard.you")
    },
    {
      space: "Design System",
      action: t("dashboard.memberAdded"),
      time: t("dashboard.daysAgo"),
      user: "Mike Johnson"
    }
  ];

  const handleSearch = (query: string, filters: any) => {
    setSearchQuery(query);
    setSearchFilters(filters);
  };

  // Filter spaces based on search and filters
  const filteredSpaces = spaces.filter(space => {
    const matchesQuery = !searchQuery || 
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVisibility = searchFilters.visibility.length === 0 ||
      searchFilters.visibility.includes(space.visibility);

    const matchesCategory = searchFilters.categories.length === 0 ||
      searchFilters.categories.some(cat => 
        space.category.toLowerCase().includes(cat.toLowerCase())
      );

    return matchesQuery && matchesVisibility && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Tenezis Spaces</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <UserProfile user={user ? {
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              plan: user.plan,
              initials: user.name.split(' ').map(n => n[0]).join('').toUpperCase()
            } : undefined} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {t("dashboard.welcome")}, {user?.name || 'Utilisateur'}!
              </h1>
              <p className="text-muted-foreground">
                Vous avez {filteredSpaces.length} {t("dashboard.activeSpaces")} et 3 {t("dashboard.newMessages")}
              </p>
            </div>
            <Button 
              onClick={() => setCreateSpaceModalOpen(true)}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("dashboard.createSpace")}
            </Button>
          </div>

          {/* Advanced Search */}
          <AdvancedSearch 
            onSearch={handleSearch}
            placeholder={t("dashboard.searchSpaces")}
            className="max-w-2xl"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">52</p>
                      <p className="text-sm text-muted-foreground">{t("dashboard.teamMembers")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">1,247</p>
                      <p className="text-sm text-muted-foreground">{t("dashboard.documents")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                      <Bot className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">15.2K</p>
                      <p className="text-sm text-muted-foreground">{t("dashboard.aiMessages")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Spaces */}
            <Card className="shadow-elegant border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{t("dashboard.yourSpaces")}</CardTitle>
                    <CardDescription>
                      {t("dashboard.manageSpaces")}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {filteredSpaces.length} {filteredSpaces.length === 1 ? t("dashboard.results") : t("dashboard.resultsPlural")}
                    </Badge>
                    <Link to="/spaces">
                      <Button variant="outline" size="sm">
                        {t("dashboard.viewAll")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredSpaces.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {t("dashboard.noSpacesFound")}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {t("dashboard.adjustSearch")}
                    </p>
                    <Button 
                      onClick={() => setCreateSpaceModalOpen(true)}
                      className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t("dashboard.createSpace")}
                    </Button>
                  </div>
                ) : (
                  filteredSpaces.map((space, index) => (
                  <div 
                    key={space.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <FunctionalSpaceCard space={space} />
                  </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="shadow-elegant border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">{t("dashboard.recentActivity")}</CardTitle>
                <CardDescription>
                  {t("dashboard.latestUpdates")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("dashboard.in")} {activity.space} • {t("dashboard.by")} {activity.user}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-elegant border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">{t("dashboard.quickActions")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-auto p-3"
                  onClick={() => setCreateSpaceModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">{t("spaces.create")}</p>
                    <p className="text-xs text-muted-foreground">{t("dashboard.startNewWorkspace")}</p>
                  </div>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-auto p-3"
                  onClick={() => setUploadModalOpen(true)}
                >
                  <FileText className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">{t("dashboard.uploadDocuments")}</p>
                    <p className="text-xs text-muted-foreground">{t("dashboard.addToKnowledge")}</p>
                  </div>
                </Button>

                <Link to="/spaces/discover">
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <TrendingUp className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <p className="font-medium">{t("dashboard.discoverSpaces")}</p>
                      <p className="text-xs text-muted-foreground">{t("dashboard.findPublicSpaces")}</p>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateSpaceModal 
        open={createSpaceModalOpen} 
        onOpenChange={setCreateSpaceModalOpen} 
      />
      <DocumentUploadModal 
        open={uploadModalOpen} 
        onOpenChange={setUploadModalOpen} 
      />
    </div>
  );
};

export default Dashboard;