import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check,
  Sparkles,
  Target,
  Brain,
  Settings,
  Globe,
  Lock
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { spaceStore } from "@/stores/spaceStore";

interface CreateSpaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { value: "research", label: "Research & Analysis", labelKey: "spaces.categories.research", icon: "🔬" },
  { value: "engineering", label: "Engineering & Tech", labelKey: "spaces.categories.engineering", icon: "⚙️" },
  { value: "marketing", label: "Marketing & Growth", labelKey: "spaces.categories.marketing", icon: "📈" },
  { value: "design", label: "Design & Creative", labelKey: "spaces.categories.design", icon: "🎨" },
  { value: "sales", label: "Sales & Customer", labelKey: "spaces.categories.sales", icon: "💼" },
  { value: "hr", label: "HR & People", labelKey: "spaces.categories.hr", icon: "👥" },
  { value: "finance", label: "Finance & Operations", labelKey: "spaces.categories.finance", icon: "💰" },
  { value: "education", label: "Education & Training", labelKey: "spaces.categories.education", icon: "📚" },
  { value: "other", label: "Other", labelKey: "spaces.categories.other", icon: "✨" }
];

const aiModels = [
  { 
    value: "gpt-5", 
    label: "GPT-5", 
    descriptionKey: "spaces.aiModels.gpt5Desc",
    costKey: "spaces.cost.high",
    badgeKey: "spaces.badges.latest"
  },
  { 
    value: "claude-sonnet-4", 
    label: "Claude Sonnet-4", 
    descriptionKey: "spaces.aiModels.claudeDesc",
    costKey: "spaces.cost.medium",
    badgeKey: "spaces.badges.recommended"
  },
  { 
    value: "gpt-4", 
    label: "GPT-4 Turbo", 
    descriptionKey: "spaces.aiModels.gpt4Desc",
    costKey: "spaces.cost.low",
    badgeKey: "spaces.badges.popular"
  }
];

export const CreateSpaceModal = ({ open, onOpenChange }: CreateSpaceModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
    visibility: "public",
    aiModel: "claude-sonnet-4",
    instructions: "",
    allowUserInvites: true,
    autoProcessDocuments: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.description || !formData.category)) {
      toast({
        title: t("common.error"),
        description: t("spaces.create.fillRequired"),
        variant: "destructive"
      });
      return;
    }
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const currentUser = spaceStore.getCurrentUser();
      const newSpace = spaceStore.createSpace({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        visibility: formData.visibility as 'public' | 'private',
        aiModel: formData.aiModel,
        owner: { 
          id: currentUser?.id || '1', 
          name: currentUser?.name || 'Current User',
          avatar: currentUser?.avatar 
        },
        documents: [],
        settings: {
          resourcesVisible: true
        }
      });
      
      toast({
        title: t("common.success"),
        description: t("spaces.create.success"),
      });

      onOpenChange(false);
      setTimeout(() => {
        navigate(`/spaces/${newSpace.id}`);
        setStep(1);
        setFormData({
          name: "",
          description: "",
          category: "",
          tags: "",
          visibility: "public",
          aiModel: "claude-sonnet-4",
          instructions: "",
          allowUserInvites: true,
          autoProcessDocuments: true
        });
      }, 300);
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("spaces.create.error"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">{t("spaces.create.basicInfo")}</h3>
              <p className="text-sm text-muted-foreground">{t("spaces.create.basicInfoDesc")}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("spaces.name")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder={t("spaces.create.namePlaceholder")}
                  className="border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("spaces.description")} *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  placeholder={t("spaces.create.descPlaceholder")}
                  rows={4}
                  className="border-border/50 focus:border-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t("spaces.category")} *</Label>
                <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                  <SelectTrigger className="border-border/50 focus:border-primary">
                    <SelectValue placeholder={t("spaces.create.selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{t(category.labelKey)}</span>
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
                  placeholder={t("spaces.create.tagsPlaceholder")}
                  className="border-border/50 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">{t("spaces.create.tagsHint")}</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">{t("spaces.create.aiConfig")}</h3>
              <p className="text-sm text-muted-foreground">{t("spaces.create.aiConfigDesc")}</p>
            </div>

            <div className="space-y-4">
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
                        <span className="font-medium">{model.label}</span>
                        <Badge variant="secondary" className="text-xs">
                          {t(model.badgeKey)}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {t(model.costKey)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7">
                    {t(model.descriptionKey)}
                  </p>
                </div>
              ))}

              <div className="space-y-2">
                <Label htmlFor="instructions">{t("spaces.instructions")}</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => updateFormData("instructions", e.target.value)}
                  placeholder={t("spaces.create.instructionsPlaceholder")}
                  rows={3}
                  className="border-border/50 focus:border-primary resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {t("spaces.create.instructionsHint")}
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Settings className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">{t("spaces.create.privacy")}</h3>
              <p className="text-sm text-muted-foreground">{t("spaces.create.privacyDesc")}</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">{t("spaces.visibility")}</Label>
                <div className="grid grid-cols-2 gap-4">
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
                    <p className="text-xs text-muted-foreground ml-7">
                      {t("spaces.create.publicDesc")}
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
                    <p className="text-xs text-muted-foreground ml-7">
                      {t("spaces.create.privateDesc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                  <div>
                    <Label className="text-base font-medium">{t("spaces.create.allowInvites")}</Label>
                    <p className="text-sm text-muted-foreground">{t("spaces.create.allowInvitesDesc")}</p>
                  </div>
                  <Switch
                    checked={formData.allowUserInvites}
                    onCheckedChange={(checked) => updateFormData("allowUserInvites", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                  <div>
                    <Label className="text-base font-medium">{t("spaces.create.autoProcess")}</Label>
                    <p className="text-sm text-muted-foreground">{t("spaces.create.autoProcessDesc")}</p>
                  </div>
                  <Switch
                    checked={formData.autoProcessDocuments}
                    onCheckedChange={(checked) => updateFormData("autoProcessDocuments", checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            {t("spaces.createSpace")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t("common.step")} {step} {t("common.of")} {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("common.back")}
            </Button>

            {step < totalSteps ? (
              <Button onClick={handleNext} disabled={isLoading}>
                {t("common.next")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    {t("spaces.create.creating")}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {t("spaces.create.createSpace")}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
