import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Users, Clock, FileText, Award } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import featureAiV2 from "@/assets/feature-ai-v2.jpg";
import featureTeamsV2 from "@/assets/feature-teams-v2.jpg";
import featureDocsV2 from "@/assets/feature-docs-v2.jpg";

export const FeatureShowcase = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* AI Feature */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20 animate-fade-in">
          <div className="space-y-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 w-fit">
              {t("features.deep.ai.title")}
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              {t("features.deep.ai.title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("features.deep.ai.desc")}
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Instant Analysis</h4>
                  <p className="text-muted-foreground text-sm">Immediate understanding of content and context</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center mt-1">
                  <Shield className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Privacy Guaranteed</h4>
                  <p className="text-muted-foreground text-sm">Your data remains private and secure</p>
                </div>
              </div>
            </div>
          </div>
          <div className="animate-scale-in" style={{animationDelay: '0.2s'}}>
            <img 
              src={featureAiV2} 
              alt="AI analyzing documents" 
              className="rounded-2xl shadow-card hover:shadow-glow transition-all duration-500"
            />
          </div>
        </div>

        {/* Team Collaboration Feature */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20 animate-fade-in">
          <div className="order-2 lg:order-1 animate-scale-in" style={{animationDelay: '0.2s'}}>
            <img 
              src={featureTeamsV2} 
              alt="Team collaboration" 
              className="rounded-2xl shadow-card hover:shadow-glow transition-all duration-500"
            />
          </div>
          <div className="space-y-8 order-1 lg:order-2">
            <Badge className="bg-accent/10 text-accent border-accent/20 w-fit">
              {t("features.deep.team.title")}
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              {t("features.deep.team.title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("features.deep.team.desc")}
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center mt-1">
                  <Users className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Secure Sharing</h4>
                  <p className="text-muted-foreground text-sm">Control who accesses what with granular permissions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Real-time</h4>
                  <p className="text-muted-foreground text-sm">See changes and comments instantly</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Organization Feature */}
        <div className="grid lg:grid-cols-2 gap-16 items-center animate-fade-in">
          <div className="space-y-8">
            <Badge className="bg-success/10 text-success border-success/20 w-fit">
              {t("features.deep.upload.title")}
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              {t("features.deep.upload.title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("features.deep.upload.desc")}
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center mt-1">
                  <FileText className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Auto Organization</h4>
                  <p className="text-muted-foreground text-sm">Smart classification by topic and importance</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-warning/10 rounded-full flex items-center justify-center mt-1">
                  <Award className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Advanced Search</h4>
                  <p className="text-muted-foreground text-sm">Find exactly what you're looking for in seconds</p>
                </div>
              </div>
            </div>
          </div>
          <div className="animate-scale-in" style={{animationDelay: '0.2s'}}>
            <img 
              src={featureDocsV2} 
              alt="Document management" 
              className="rounded-2xl shadow-card hover:shadow-glow transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};