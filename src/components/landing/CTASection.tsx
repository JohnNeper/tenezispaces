import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

export const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Header */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Ready to transform your workflow?</span>
            </div>
            
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground leading-tight">
              {t("cta.title")}
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("cta.subtitle")}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105 group text-lg px-8 py-6 w-full sm:w-auto"
              >
                {t("cta.button")}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary/20 hover:bg-primary/5 hover:scale-105 transition-all text-lg px-8 py-6 w-full sm:w-auto"
              >
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="pt-8 space-y-4">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Cancel anytime</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Join 10,000+ professionals who've already made the switch
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};