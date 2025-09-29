import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  FileText, 
  Bot, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Crown,
  Clock,
  Globe,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { spaceStore, type Space } from "@/stores/spaceStore";

export default function JoinSpace() {
  const { spaceId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [space, setSpace] = useState<Space | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!spaceId) return;
    
    const foundSpace = spaceStore.getSpaceById(spaceId);
    setSpace(foundSpace);
    
    if (foundSpace && token) {
      const isValid = spaceStore.validateInviteToken(spaceId, token);
      setIsValidToken(isValid);
    } else if (foundSpace && foundSpace.visibility === 'public') {
      setIsValidToken(true);
    } else {
      setIsValidToken(false);
    }
  }, [spaceId, token]);

  const handleJoinSpace = async () => {
    if (!space || !user) return;
    
    setIsJoining(true);
    
    try {
      // Vérifier si l'utilisateur est déjà membre
      const isAlreadyMember = space.members.some(member => member.id === user.id);
      if (isAlreadyMember) {
        toast({
          title: t("join.alreadyMember"),
          description: t("join.redirecting"),
        });
        navigate(`/spaces/${spaceId}`);
        return;
      }
      
      const success = spaceStore.joinSpace(spaceId!, user.id, user.name);
      
      if (success) {
        setHasJoined(true);
        toast({
          title: t("join.success"),
          description: t("join.welcomeToSpace", { spaceName: space.name }),
        });
        
        // Rediriger vers l'espace après 2 secondes
        setTimeout(() => {
          navigate(`/spaces/${spaceId}`);
        }, 2000);
      } else {
        throw new Error('Failed to join space');
      }
    } catch (error) {
      toast({
        title: t("join.error"),
        description: t("join.tryAgain"),
        variant: "destructive"
      });
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
            <CardTitle className="text-xl">{t("join.authRequired")}</CardTitle>
            <CardDescription>{t("join.loginToJoin")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full bg-gradient-primary">
              <Link to="/login">{t("auth.login")}</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/signup">{t("auth.signup")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!space || isValidToken === null) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elegant border-border/50">
          <CardContent className="p-6 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t("join.loading")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elegant border-border/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">{t("join.invalidInvite")}</CardTitle>
            <CardDescription>{t("join.expiredOrInvalid")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/discover">{t("join.browsePublic")}</Link>
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
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <CardTitle className="text-xl">{t("join.joinedSuccess")}</CardTitle>
            <CardDescription>{t("join.redirectingToSpace")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/discover" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>{t("join.backToDiscover")}</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">{t("join.joinSpace")}</span>
          </div>
          
          <div className="w-24"></div>
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
                      {space.visibility === 'public' ? (
                        <>
                          <Globe className="w-3 h-3" />
                          {t("spaces.public")}
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          {t("spaces.private")}
                        </>
                      )}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">{space.description}</CardDescription>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="gap-1">
                      <Bot className="w-3 h-3" />
                      {space.aiModel}
                    </Badge>
                    <Badge variant="secondary">{space.category}</Badge>
                    {space.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Statistiques */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{space.stats.members}</div>
                  <div className="text-sm text-muted-foreground">{t("spaces.members")}</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <FileText className="w-5 h-5 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold text-foreground">{space.stats.documents}</div>
                  <div className="text-sm text-muted-foreground">{t("spaces.documents")}</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Clock className="w-5 h-5 mx-auto mb-2 text-success" />
                  <div className="text-2xl font-bold text-foreground">{space.stats.messages}</div>
                  <div className="text-sm text-muted-foreground">{t("spaces.messages")}</div>
                </div>
              </div>

              {/* Propriétaire */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">{t("join.spaceOwner")}</h3>
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {space.owner.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{space.owner.name}</span>
                      <Crown className="w-4 h-4 text-warning" />
                    </div>
                    <span className="text-sm text-muted-foreground">{t("spaces.owner")}</span>
                  </div>
                </div>
              </div>

              {/* Membres récents */}
              {space.members.length > 1 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">{t("join.recentMembers")}</h3>
                  <div className="space-y-2">
                    {space.members.slice(1, 4).map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-2 bg-muted/10 rounded-lg">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                            {member.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-foreground">{member.name}</span>
                          <div className="text-xs text-muted-foreground">{member.lastActive}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action de rejoindre */}
              <div className="pt-4 border-t border-border/50">
                <Button 
                  onClick={handleJoinSpace}
                  disabled={isJoining}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 h-12 text-base"
                >
                  {isJoining ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                      {t("join.joining")}
                    </div>
                  ) : (
                    <>
                      <Users className="w-5 h-5 mr-2" />
                      {t("join.joinThisSpace")}
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