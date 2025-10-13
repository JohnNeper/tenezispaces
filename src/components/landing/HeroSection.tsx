import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import heroModernV2 from "@/assets/hero-modern-v2.jpg";

export const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-subtle"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <Badge className="bg-primary/10 text-primary border-primary/20 w-fit">
              {t("landing.hero.badge")}
            </Badge>
            
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
                {t("landing.hero.title")}{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  {t("landing.hero.subtitle1")}
                </span>{" "}
                {t("landing.hero.subtitle2")}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {t("landing.hero.description")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105 group text-lg px-8 py-6 w-full sm:w-auto"
                >
                  {t("landing.hero.cta")}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/discover">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary/20 hover:bg-primary/5 hover:scale-105 transition-all group text-lg px-8 py-6 w-full sm:w-auto"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {t("landing.hero.discover")}
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success" />
                <span>{t("landing.hero.free")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success" />
                <span>{t("landing.hero.nocard")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success" />
                <span>{t("landing.hero.setup")}</span>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">{t("landing.hero.trusted")}</p>
            </div>
          </div>

          <div className="relative animate-scale-in" style={{animationDelay: '0.3s'}}>
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20"></div>
            <img 
              src={heroModernV2} 
              alt={t("landing.hero.image.alt")} 
              className="relative w-full h-auto rounded-3xl shadow-elegant hover:shadow-glow transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};