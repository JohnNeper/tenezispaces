import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, FileText, Users, BarChart3 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export const FeaturesGrid = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Bot,
      title: t("features.ai.title"),
      description: t("features.ai.desc"),
      color: "primary",
      delay: "0s"
    },
    {
      icon: FileText,
      title: t("features.docs.title"),
      description: t("features.docs.desc"),
      color: "success",
      delay: "0.1s"
    },
    {
      icon: Users,
      title: t("features.teams.title"),
      description: t("features.teams.desc"),
      color: "accent",
      delay: "0.2s"
    },
    {
      icon: BarChart3,
      title: t("features.analytics.title"),
      description: t("features.analytics.desc"),
      color: "warning",
      delay: "0.3s"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6 mb-16 animate-fade-in">
          <Badge className="bg-accent/10 text-accent border-accent/20">
            {t("features.badge")}
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
            {t("features.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-card transition-all duration-500 border-0 bg-gradient-card hover:scale-105 hover:-translate-y-2 animate-fade-in"
                style={{animationDelay: feature.delay}}
              >
                <CardContent className="p-8 text-center space-y-6">
                  <div className={`w-16 h-16 bg-${feature.color}/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 text-${feature.color}`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};