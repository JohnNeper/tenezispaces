import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Sparkles, 
  Globe, 
  Lock, 
  Bot, 
  FileText,
  Users,
  Settings,
  Zap,
  Target,
  Brain
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { LanguageSelector } from "@/components/LanguageSelector";

const categories = [
  { value: "research", label: "Research & Analysis", icon: "🔬" },
  { value: "engineering", label: "Engineering & Tech", icon: "⚙️" },
  { value: "marketing", label: "Marketing & Growth", icon: "📈" },
  { value: "design", label: "Design & Creative", icon: "🎨" },
  { value: "sales", label: "Sales & Customer", icon: "💼" },
  { value: "hr", label: "HR & People", icon: "👥" },
  { value: "finance", label: "Finance & Operations", icon: "💰" },
  { value: "education", label: "Education & Training", icon: "📚" },
  { value: "other", label: "Other", icon: "✨" }
];

const aiModels = [
  { 
    value: "gpt-5", 
    label: "GPT-5", 
    description: "Most advanced reasoning and creativity",
    cost: "High",
    badge: "Latest"
  },
  { 
    value: "claude-sonnet-4", 
    label: "Claude Sonnet-4", 
    description: "Excellent for analysis and writing",
    cost: "Medium",
    badge: "Recommended"
  },
  { 
    value: "gpt-4", 
    label: "GPT-4 Turbo", 
    description: "Fast and reliable for most tasks",
    cost: "Low",
    badge: "Popular"
  }
];

export default function CreateSpaceEnhanced() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
    visibility: "public",
    aiModel: "claude-sonnet-4",
    instructions: "",
    allowUserInvites: true,
    documentVisibility: "members",
    autoProcessDocuments: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: t("common.success"),
        description: t("spaces.create.success"),
      });

      navigate("/spaces");
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "Failed to create space. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>{t("common.back")}</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <LanguageSelector />
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-foreground">{t("spaces.createSpace")}</span>
            </div>
          </div>
          
          <div className="w-32"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="text-center space-y-4 mb-12">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Create Your Intelligent Workspace</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Set up a space where your team can collaborate with AI, organize documents, and unlock intelligent insights from your knowledge base.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card className="shadow-elegant border-border/50 bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      Define the core identity and purpose of your space
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("spaces.name")} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        placeholder="e.g., Product Research Hub, Engineering Docs"
                        className="border-border/50 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">{t("spaces.description")} *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => updateFormData("description", e.target.value)}
                        placeholder="Describe what this space is for and what kind of documents it will contain..."
                        rows={4}
                        className="border-border/50 focus:border-primary resize-none"
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">{t("spaces.category")} *</Label>
                        <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                          <SelectTrigger className="border-border/50 focus:border-primary">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                <div className="flex items-center gap-2">
                                  <span>{category.icon}</span>
                                  <span>{category.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags">{t("spaces.tags")}</Label>
                        <Input
                          id="tags"
                          value={formData.tags}
                          onChange={(e) => updateFormData("tags", e.target.value)}
                          placeholder="research, analysis, reports"
                          className="border-border/50 focus:border-primary"
                        />
                        <p className="text-xs text-muted-foreground">Separate with commas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Configuration */}
                <Card className="shadow-elegant border-border/50 bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-accent" />
                      AI Model Selection
                    </CardTitle>
                    <CardDescription>
                      Choose the AI model that best fits your space's needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      {aiModels.map((model) => (
                        <div
                          key={model.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.aiModel === model.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border/50 hover:border-primary/50 hover:bg-muted/30'
                          }`}
                          onClick={() => updateFormData("aiModel", model.value)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                                formData.aiModel === model.value
                                  ? 'border-primary bg-primary'
                                  : 'border-muted-foreground'
                              }`} />
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">{model.label}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {model.badge}
                                </Badge>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {model.cost} cost
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground ml-7">
                            {model.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">{t("spaces.instructions")}</Label>
                      <Textarea
                        id="instructions"
                        value={formData.instructions}
                        onChange={(e) => updateFormData("instructions", e.target.value)}
                        placeholder="Provide specific instructions for the AI on how to respond, what tone to use, and what to focus on when analyzing documents..."
                        rows={3}
                        className="border-border/50 focus:border-primary resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        These instructions will guide the AI's responses in this space
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Privacy & Permissions */}
                <Card className="shadow-elegant border-border/50 bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-warning" />
                      Privacy & Permissions
                    </CardTitle>
                    <CardDescription>
                      Control who can access your space and how
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-base font-medium">{t("spaces.visibility")}</Label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.visibility === 'public'
                              ? 'border-primary bg-primary/5'
                              : 'border-border/50 hover:border-primary/50'
                          }`}
                          onClick={() => updateFormData("visibility", "public")}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                              formData.visibility === 'public'
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                            }`} />
                            <Globe className="w-5 h-5 text-success" />
                            <span className="font-medium">{t("spaces.public")}</span>
                          </div>
                          <p className="text-sm text-muted-foreground ml-7">
                            Anyone can discover and join this space
                          </p>
                        </div>

                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.visibility === 'private'
                              ? 'border-primary bg-primary/5'
                              : 'border-border/50 hover:border-primary/50'
                          }`}
                          onClick={() => updateFormData("visibility", "private")}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                              formData.visibility === 'private'
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                            }`} />
                            <Lock className="w-5 h-5 text-accent" />
                            <span className="font-medium">{t("spaces.private")}</span>
                          </div>
                          <p className="text-sm text-muted-foreground ml-7">
                            Only invited members can access this space
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Allow user invites</Label>
                          <p className="text-sm text-muted-foreground">Members can invite other users to this space</p>
                        </div>
                        <Switch
                          checked={formData.allowUserInvites}
                          onCheckedChange={(checked) => updateFormData("allowUserInvites", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Auto-process documents</Label>
                          <p className="text-sm text-muted-foreground">Automatically analyze new documents with AI</p>
                        </div>
                        <Switch
                          checked={formData.autoProcessDocuments}
                          onCheckedChange={(checked) => updateFormData("autoProcessDocuments", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview Sidebar */}
              <div className="space-y-6">
                <Card className="shadow-elegant border-border/50 bg-gradient-card sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg">Preview</CardTitle>
                    <CardDescription>How your space will appear to others</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-glow">
                          {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {formData.name || "Space Name"}
                          </h3>
                          <div className="flex items-center gap-2">
                            {formData.visibility === 'public' ? (
                              <Globe className="w-3 h-3 text-success" />
                            ) : (
                              <Lock className="w-3 h-3 text-muted-foreground" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formData.visibility === 'public' ? 'Public' : 'Private'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {formData.description || "Space description will appear here..."}
                      </p>

                      {(formData.category || formData.tags) && (
                        <div className="flex flex-wrap gap-1">
                          {formData.category && (
                            <Badge variant="outline" className="text-xs">
                              {categories.find(c => c.value === formData.category)?.label}
                            </Badge>
                          )}
                          {formData.tags.split(',').filter(tag => tag.trim()).slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {formData.aiModel && (
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium">
                            {aiModels.find(m => m.value === formData.aiModel)?.label}
                          </span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Features Enabled:</h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Zap className="w-3 h-3" />
                          <span>AI-powered document analysis</span>
                        </div>
                        {formData.allowUserInvites && (
                          <div className="flex items-center gap-2">
                            <Users className="w-3 h-3" />
                            <span>Member invitations enabled</span>
                          </div>
                        )}
                        {formData.autoProcessDocuments && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-3 h-3" />
                            <span>Automatic document processing</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    disabled={!formData.name || !formData.description || !formData.category || isLoading}
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                        Creating Space...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create Space
                      </>
                    )}
                  </Button>
                  
                  <Link to="/spaces">
                    <Button variant="outline" size="lg" className="w-full" disabled={isLoading}>
                      Cancel
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}