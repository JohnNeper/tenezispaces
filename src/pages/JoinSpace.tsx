import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, FileText, Bot, CheckCircle, XCircle, ArrowLeft, Crown, Globe, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useSpaces, useSpaceDetails } from "@/hooks/useSpaces";

export default function JoinSpace() {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { joinSpace } = useSpaces();
  const { space, members, loading } = useSpaceDetails(spaceId);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  // Check if user is already a member
  useEffect(() => {
    if (user && members.length > 0) {
      const isMember = members.some(m => m.user_id === user.id);
      if (isMember) {
        navigate(`/spaces/${spaceId}`, { replace: true });
      }
    }
  }, [user, members, spaceId, navigate]);

  const handleJoinSpace = async () => {
    if (!space || !user) return;
    setIsJoining(true);
    
    try {
      await joinSpace(space.id);
      setHasJoined(true);
      toast({
        title: t("join.success") || "Succès",
        description: `Bienvenue dans ${space.name} !`,
      });
      setTimeout(() => navigate(`/spaces/${spaceId}`), 1500);
    } catch (error: any) {
      if (error?.message?.includes('duplicate')) {
        navigate(`/spaces/${spaceId}`);
      } else {
        toast({
          title: t("join.error") || "Erreur",
          description: "Impossible de rejoindre cet espace",
          variant: "destructive"
        });
      }
    } finally {
      setIsJoining(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elegant border-border/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Connexion requise</CardTitle>
            <CardDescription>Connectez-vous pour rejoindre cet espace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full bg-gradient-primary">
              <Link to="/login">Se connecter</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/signup">Créer un compte</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elegant border-border/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Espace introuvable</CardTitle>
            <CardDescription>Cet espace n'existe pas ou n'est pas accessible</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/discover">Explorer les espaces</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasJoined) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elegant border-border/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">Bienvenue !</CardTitle>
            <CardDescription>Redirection vers l'espace...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/discover" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </Link>
          <span className="text-xl font-bold text-foreground">Rejoindre un espace</span>
          <div className="w-24" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-elegant border-border/50 bg-gradient-card">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-glow">
                  {space.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-2xl">{space.name}</CardTitle>
                    <Badge variant={space.visibility === 'public' ? 'default' : 'secondary'} className="gap-1">
                      {space.visibility === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {space.visibility === 'public' ? 'Public' : 'Privé'}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">{space.description}</CardDescription>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="gap-1">
                      <Bot className="w-3 h-3" />
                      {space.ai_model}
                    </Badge>
                    <Badge variant="secondary">{space.category}</Badge>
                    {(space.tags || []).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{members.length}</div>
                  <div className="text-sm text-muted-foreground">Membres</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <FileText className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{space.category}</div>
                  <div className="text-sm text-muted-foreground">Catégorie</div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <Button 
                  onClick={handleJoinSpace}
                  disabled={isJoining}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 h-12 text-base"
                >
                  {isJoining ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Rejoindre...
                    </div>
                  ) : (
                    <>
                      <Users className="w-5 h-5 mr-2" />
                      Rejoindre cet espace
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
