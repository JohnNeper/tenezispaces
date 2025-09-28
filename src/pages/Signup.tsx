import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Check, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { signup, socialAuth, isLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const passwordStrength = {
    hasLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const result = signupSchema.safeParse(formData);
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

    if (!isPasswordStrong) {
      toast({
        title: t("auth.weakPassword"),
        description: t("auth.weakPasswordDesc"),
        variant: "destructive"
      });
      return;
    }

    try {
      await signup(formData.name, formData.email, formData.password);
      toast({
        title: t("auth.signupSuccess"),
        description: t("auth.signupSuccessDesc"),
      });
    } catch (error) {
      toast({
        title: t("auth.signupError"),
        description: t("auth.signupErrorDesc"),
        variant: "destructive"
      });
    }
  };

  const handleSocialSuccess = () => {
    toast({
      title: t("auth.socialSignup"),
      description: t("auth.socialSignupDesc"),
    });
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
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
            <h1 className="text-3xl font-bold text-foreground">{t("auth.signup")}</h1>
            <p className="text-muted-foreground">
              {t("auth.signupDesc")}
            </p>
          </div>

          <Card className="shadow-elegant border-border/50 bg-gradient-card backdrop-blur-md">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center text-foreground">{t("nav.signup")}</CardTitle>
              <CardDescription className="text-center">
                {t("auth.signupDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SocialAuthButtons mode="signup" onSuccess={handleSocialSuccess} />
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    {t("auth.fullName")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder={t("auth.fullName")}
                      value={formData.name}
                      onChange={handleInputChange("name")}
                      className={`pl-10 h-12 border-border/50 focus:border-primary focus:ring-primary/20 ${
                        errors.name ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      required
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t("auth.email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("auth.email")}
                      value={formData.email}
                      onChange={handleInputChange("email")}
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
                    {t("auth.password")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder={t("auth.password")}
                      value={formData.password}
                      onChange={handleInputChange("password")}
                      className={`pl-10 h-12 border-border/50 focus:border-primary focus:ring-primary/20 ${
                        errors.password ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      required
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                  
                  {formData.password && (
                    <div className="space-y-2 mt-3 p-3 bg-muted/30 rounded-lg">
                      <div className="text-xs font-medium text-muted-foreground mb-2">{t("auth.passwordCriteria")}</div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-xs">
                          {passwordStrength.hasLength ? (
                            <Check className="w-3 h-3 text-success" />
                          ) : (
                            <X className="w-3 h-3 text-destructive" />
                          )}
                          <span className={passwordStrength.hasLength ? "text-success" : "text-muted-foreground"}>
                            {t("auth.minLength")}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          {passwordStrength.hasUppercase ? (
                            <Check className="w-3 h-3 text-success" />
                          ) : (
                            <X className="w-3 h-3 text-destructive" />
                          )}
                          <span className={passwordStrength.hasUppercase ? "text-success" : "text-muted-foreground"}>
                            {t("auth.uppercase")}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          {passwordStrength.hasLowercase ? (
                            <Check className="w-3 h-3 text-success" />
                          ) : (
                            <X className="w-3 h-3 text-destructive" />
                          )}
                          <span className={passwordStrength.hasLowercase ? "text-success" : "text-muted-foreground"}>
                            {t("auth.lowercase")}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          {passwordStrength.hasNumber ? (
                            <Check className="w-3 h-3 text-success" />
                          ) : (
                            <X className="w-3 h-3 text-destructive" />
                          )}
                          <span className={passwordStrength.hasNumber ? "text-success" : "text-muted-foreground"}>
                            {t("auth.number")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    {t("auth.confirmPassword")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder={t("auth.confirmPassword")}
                      value={formData.confirmPassword}
                      onChange={handleInputChange("confirmPassword")}
                      className={`pl-10 h-12 border-border/50 focus:border-primary focus:ring-primary/20 ${
                        errors.confirmPassword ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      required
                    />
                    {formData.confirmPassword && (
                      <div className="absolute right-3 top-3">
                        {passwordsMatch ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <X className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  disabled={isLoading || !isPasswordStrong || !passwordsMatch}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t("auth.creatingAccount")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{t("auth.createAccount")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-sm text-muted-foreground">
                    {t("auth.hasAccount")}{" "}
                    <Link 
                      to="/login" 
                      className="text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      {t("nav.login")}
                    </Link>
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-muted-foreground">
            {t("auth.acceptTermsSignup")}{" "}
            <Link to="/terms" className="text-primary hover:underline">
              {t("auth.terms")}
            </Link>{" "}
            et notre{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              {t("auth.privacy")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;