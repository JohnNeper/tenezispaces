import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Building2, 
  Briefcase, 
  Users2, 
  BookOpen, 
  TrendingUp,
  Search,
  MessageSquare,
  FileStack,
  Clock,
  Award,
  Lightbulb
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export const UseCases = () => {
  const { t } = useLanguage();

  const useCases = [
    {
      icon: GraduationCap,
      title: "Education & Research",
      description: "Perfect for students, researchers, and academic institutions to organize and analyze research papers, create study materials, and collaborate on projects.",
      features: ["Research Paper Analysis", "Study Group Collaboration", "Citation Management", "Knowledge Synthesis"],
      color: "primary"
    },
    {
      icon: Building2,
      title: "Enterprise Teams",
      description: "Streamline corporate knowledge management, onboard new employees faster, and maintain institutional knowledge across departments.",
      features: ["Company Documentation", "Employee Onboarding", "Policy Management", "Cross-team Collaboration"],
      color: "accent"
    },
    {
      icon: Briefcase,
      title: "Professional Services",
      description: "Consultants, lawyers, and professionals can organize client documents, create proposals, and maintain case knowledge efficiently.",
      features: ["Client Document Organization", "Case Studies", "Proposal Generation", "Expert Knowledge Base"],
      color: "success"
    },
    {
      icon: Users2,
      title: "Small Business Teams",
      description: "Growing teams can centralize their knowledge, improve internal communication, and scale their operations more effectively.",
      features: ["Process Documentation", "Team Training", "Standard Operating Procedures", "Scalable Knowledge Management"],
      color: "warning"
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Save 5+ Hours Weekly",
      description: "Reduce time spent searching for information"
    },
    {
      icon: TrendingUp,
      title: "Boost Productivity by 40%",
      description: "Faster decision-making with instant insights"
    },
    {
      icon: Award,
      title: "Improve Collaboration",
      description: "Better team alignment and knowledge sharing"
    },
    {
      icon: Lightbulb,
      title: "Discover Hidden Insights",
      description: "AI reveals patterns you might have missed"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Use Cases Header */}
        <div className="text-center space-y-6 mb-16 animate-fade-in">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Use Cases
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
            Built for Every Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From startups to enterprises, researchers to consultants - discover how Tenezis Spaces transforms knowledge work
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-card transition-all duration-500 border-0 bg-gradient-card hover:scale-105 animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-${useCase.color}/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 text-${useCase.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{useCase.title}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground text-sm">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {useCase.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className={`w-1.5 h-1.5 bg-${useCase.color} rounded-full`}></div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
            Measurable Impact on Your Workflow
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who've already transformed their productivity
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={index}
                className="text-center border-0 bg-gradient-card hover:shadow-card transition-all duration-300 animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
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