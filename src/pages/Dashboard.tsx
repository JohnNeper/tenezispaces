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
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    categories: [],
    visibility: [],
    roles: [],
    activity: []
  });

  // Mock data for spaces
  const spaces = [
    {
      id: 1,
      name: "Product Strategy",
      description: "Strategic planning and roadmap discussions",
      type: "private",
      role: "owner",
      members: 8,
      lastActivity: "2 hours ago",
      messages: 124,
      category: "Business"
    },
    {
      id: 2,
      name: "AI Research Hub",
      description: "Latest developments in AI and machine learning",
      type: "public",
      role: "collaborator", 
      members: 32,
      lastActivity: "5 minutes ago",
      messages: 892,
      category: "Technology"
    },
    {
      id: 3,
      name: "Design System",
      description: "UI/UX guidelines and component library",
      type: "private",
      role: "user",
      members: 12,
      lastActivity: "1 day ago", 
      messages: 67,
      category: "Design"
    }
  ];

  const recentActivity = [
    {
      space: "AI Research Hub",
      action: "Nouveau document uploadé",
      time: "il y a 5 minutes",
      user: "Sarah Chen"
    },
    {
      space: "Product Strategy", 
      action: "Message envoyé à l'IA",
      time: "il y a 2 heures",
      user: "Vous"
    },
    {
      space: "Design System",
      action: "Membre ajouté",
      time: "il y a 1 jour",
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
      searchFilters.visibility.includes(space.type);

    const matchesRole = searchFilters.roles.length === 0 ||
      searchFilters.roles.includes(space.role);

    const matchesCategory = searchFilters.categories.length === 0 ||
      searchFilters.categories.some(cat => 
        space.category.toLowerCase().includes(cat.toLowerCase())
      );

    return matchesQuery && matchesVisibility && matchesRole && matchesCategory;
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
                Bienvenue, {user?.name || 'Utilisateur'}!
              </h1>
              <p className="text-muted-foreground">
                Vous avez {filteredSpaces.length} espaces actifs et 3 nouveaux messages
              </p>
            </div>
            <Link to="/spaces/create">
              <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Créer un espace
              </Button>
            </Link>
          </div>

          {/* Advanced Search */}
          <AdvancedSearch 
            onSearch={handleSearch}
            placeholder="Rechercher dans vos espaces..."
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
                      <p className="text-sm text-muted-foreground">Membres d'équipe</p>
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
                      <p className="text-sm text-muted-foreground">Documents</p>
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
                      <p className="text-sm text-muted-foreground">Messages IA</p>
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
                    <CardTitle className="text-xl">Vos Espaces</CardTitle>
                    <CardDescription>
                      Gérez et accédez à vos espaces de travail collaboratifs
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {filteredSpaces.length} résultat{filteredSpaces.length !== 1 ? 's' : ''}
                    </Badge>
                    <Link to="/spaces">
                      <Button variant="outline" size="sm">
                        Voir tout
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
                      Aucun espace trouvé
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Essayez d'ajuster vos critères de recherche ou créez un nouvel espace
                    </p>
                    <Link to="/spaces/create">
                      <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                        <Plus className="w-4 h-4 mr-2" />
                        Créer un espace
                      </Button>
                    </Link>
                  </div>
                ) : (
                  filteredSpaces.map((space) => (
                  <Card key={space.id} className="border border-border/50 hover:shadow-card transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                              {space.type === "private" ? (
                                <Lock className="w-5 h-5 text-primary-foreground" />
                              ) : (
                                <Globe className="w-5 h-5 text-primary-foreground" />
                              )}
                            </div>
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-foreground">{space.name}</h3>
                                {space.role === "owner" && (
                                  <Crown className="w-4 h-4 text-warning" />
                                )}
                                <Badge variant={space.type === "private" ? "secondary" : "outline"}>
                                  {space.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {space.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Users className="w-3 h-3" />
                                  <span>{space.members} membres</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MessageSquare className="w-3 h-3" />
                                  <span>{space.messages} messages</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{space.lastActivity}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
                <CardTitle className="text-lg">Activité récente</CardTitle>
                <CardDescription>
                  Dernières mises à jour de vos espaces
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
                        dans {activity.space} • par {activity.user}
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
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/spaces/create">
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <Plus className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <p className="font-medium">Créer un espace</p>
                      <p className="text-xs text-muted-foreground">Démarrer un nouvel espace de travail</p>
                    </div>
                  </Button>
                </Link>
                
                <Link to="/documents/upload">
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <FileText className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <p className="font-medium">Uploader des documents</p>
                      <p className="text-xs text-muted-foreground">Ajouter des fichiers à la base de connaissances</p>
                    </div>
                  </Button>
                </Link>

                <Link to="/spaces/discover">
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <TrendingUp className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <p className="font-medium">Découvrir des espaces</p>
                      <p className="text-xs text-muted-foreground">Trouver des espaces publics</p>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;