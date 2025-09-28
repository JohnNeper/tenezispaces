import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis")
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { login, socialAuth, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await login(email, password);
      toast({
        title: "Connexion réussie!",
        description: "Vous êtes maintenant connecté à votre compte.",
      });
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez vos identifiants et réessayez.",
        variant: "destructive"
      });
    }
  };

  const handleSocialSuccess = () => {
    toast({
      title: "Connexion réussie!",
      description: "Vous êtes maintenant connecté.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Tenezis
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Content de vous revoir</h1>
            <p className="text-muted-foreground">
              Connectez-vous à votre espace intelligent
            </p>
          </div>

          <Card className="shadow-elegant border-border/50 bg-gradient-card backdrop-blur-md">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center text-foreground">Connexion</CardTitle>
              <CardDescription className="text-center">
                Entrez vos identifiants pour accéder à votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SocialAuthButtons mode="login" onSuccess={handleSocialSuccess} />

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Entrez votre email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 h-12 border-border/50 focus:border-primary focus:ring-primary/20 ${
                        errors.email ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 h-12 border-border/50 focus:border-primary focus:ring-primary/20 ${
                        errors.password ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      required
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connexion...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Se connecter</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-sm text-muted-foreground">
                    Pas encore de compte ?{" "}
                    <Link 
                      to="/signup" 
                      className="text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      S'inscrire
                    </Link>
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-muted-foreground">
            En vous connectant, vous acceptez nos{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;