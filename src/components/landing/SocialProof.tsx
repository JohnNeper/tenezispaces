import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export const SocialProof = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Research Director, TechCorp",
      avatar: "SC",
      rating: 5,
      quote: "Tenezis has revolutionized how our research team manages and analyzes documents. The AI understands our domain expertise perfectly.",
      gradient: "primary"
    },
    {
      name: "Marcus Johnson", 
      role: "Startup Founder",
      avatar: "MJ",
      rating: 5,
      quote: "We've saved countless hours with intelligent document organization. Our team collaborates more effectively than ever before.",
      gradient: "accent"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "University Professor",
      avatar: "ER", 
      rating: 5,
      quote: "Perfect for academic research. Students can now easily find relevant papers and collaborate on complex research projects.",
      gradient: "success"
    },
    {
      name: "James Wilson",
      role: "Legal Consultant",
      avatar: "JW",
      rating: 5,
      quote: "Case research and client document management has never been easier. The AI provides insights we wouldn't have found otherwise.",
      gradient: "warning"
    },
    {
      name: "Lisa Thompson",
      role: "Product Manager, InnovateCo",
      avatar: "LT",
      rating: 5,
      quote: "Our product documentation is now searchable and intelligent. New team members get up to speed in days, not weeks.",
      gradient: "primary"
    },
    {
      name: "David Park",
      role: "Consulting Firm Partner",
      avatar: "DP",
      rating: 5,
      quote: "Client proposals and knowledge management are streamlined. We can focus on high-value work instead of searching for documents.",
      gradient: "accent"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "500,000+", label: "Documents Processed" },
    { number: "95%", label: "User Satisfaction" },
    { number: "5+ Hours", label: "Saved Weekly" }
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-6 mb-16 animate-fade-in">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {t("social.badge")}
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Trusted by Professionals Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of teams who've already transformed their document workflow
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="border-0 bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300 animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Rating */}
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                    ))}
                  </div>
                  
                  {/* Quote Icon */}
                  <Quote className={`w-8 h-8 text-${testimonial.gradient} opacity-50`} />
                  
                  {/* Testimonial Text */}
                  <p className="text-foreground leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-${testimonial.gradient} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-semibold text-sm">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center animate-fade-in">
          <p className="text-sm text-muted-foreground mb-6">
            Trusted by teams at leading organizations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-semibold">TechCorp</div>
            <div className="text-lg font-semibold">InnovateCo</div>
            <div className="text-lg font-semibold">University Research Labs</div>
            <div className="text-lg font-semibold">Consulting Partners</div>
            <div className="text-lg font-semibold">Legal Associates</div>
          </div>
        </div>
      </div>
    </section>
  );
};