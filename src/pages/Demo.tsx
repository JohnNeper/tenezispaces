import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  ArrowLeft, 
  MessageCircle, 
  FileText, 
  Users, 
  Brain,
  Zap,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

const Demo = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Demo Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-subtle overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:shadow-glow transition-all">
              <Play className="w-4 h-4 mr-2" />
              {t('demo.badge')}
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              {t('demo.title')}
              <span className="bg-gradient-hero bg-clip-text text-transparent"> {t('demo.subtitle')}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('demo.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105">
                  {t('demo.cta')}
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5 hover:scale-105 transition-all">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  {t('demo.back')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-card transition-all duration-500 border-border/50 bg-gradient-card hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{t('demo.chat.title')}</CardTitle>
                <CardDescription>{t('demo.chat.desc')}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-card transition-all duration-500 border-border/50 bg-gradient-card hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">{t('demo.docs.title')}</CardTitle>
                <CardDescription>{t('demo.docs.desc')}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-card transition-all duration-500 border-border/50 bg-gradient-card hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-success/20 transition-colors">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <CardTitle className="text-xl">{t('demo.collab.title')}</CardTitle>
                <CardDescription>{t('demo.collab.desc')}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              {t('demo.coming.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('demo.coming.desc')}
            </p>
            <Link to="/signup">
              <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105" size="lg">
                <Sparkles className="w-5 h-5 mr-2" />
                {t('demo.coming.cta')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Demo;