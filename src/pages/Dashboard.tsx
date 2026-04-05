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
  Target,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UserProfile } from "@/components/UserProfile";
import { LanguageSelector } from "@/components/LanguageSelector";
import { CreateSpaceModal } from "@/components/CreateSpaceModal";
import { DocumentUploadModal } from "@/components/DocumentUploadModal";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useSpaces } from "@/hooks/useSpaces";

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { spaces, loading } = useSpaces();
  const [searchQuery, setSearchQuery] = useState("");
  const [createSpaceModalOpen, setCreateSpaceModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const filteredSpaces = spaces.filter(space => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return space.name.toLowerCase().includes(q) ||
      (space.description || '').toLowerCase().includes(q) ||
      (space.category || '').toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Tenezis Spaces</span>
          </Link>

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
                {t("dashboard.activeSpaces")}: {spaces.length}
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
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Spaces */}
            <Card className="shadow-elegant border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{t("dashboard.yourSpaces")}</CardTitle>
                    <CardDescription>{t("dashboard.manageSpaces")}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {filteredSpaces.length} spaces
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : filteredSpaces.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {t("dashboard.noSpacesFound")}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Créez votre premier espace pour commencer
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
                  filteredSpaces.map((space) => (
                    <Card
                      key={space.id}
                      className="border border-border/50 hover:shadow-card transition-all group cursor-pointer bg-gradient-card"
                      onClick={() => navigate(`/spaces/${space.id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold text-lg">
                              {space.image_url ? (
                                <img src={space.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                space.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                  {space.name}
                                </h3>
                                {space.owner_id === user?.id && (
                                  <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                )}
                                <Badge variant={space.visibility === "private" ? "secondary" : "outline"} className="flex-shrink-0 gap-1">
                                  {space.visibility === "private" ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                                  {space.visibility === "private" ? "Privé" : "Public"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {space.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {(space.tags || []).slice(0, 3).map((tag, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="text-xs">{space.ai_model || 'IA'}</Badge>
                            <Badge variant="outline" className="text-xs">{space.category}</Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(space.updated_at).toLocaleDateString()}</span>
                          </div>
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
                    <p className="text-xs text-muted-foreground">Démarrer un nouvel espace</p>
                  </div>
                </Button>

                <Link to="/discover" className="block">
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <TrendingUp className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <p className="font-medium">{t("dashboard.discoverSpaces")}</p>
                      <p className="text-xs text-muted-foreground">Explorer les espaces publics</p>
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
