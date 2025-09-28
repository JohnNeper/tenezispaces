import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ArrowRight, 
  Info, 
  Eye, 
  EyeOff, 
  Bot, 
  CheckCircle,
  Globe,
  Lock,
  Users,
  FileText,
  Crown,
  Zap,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface SpaceData {
  name: string;
  description: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  resourcesVisible: boolean;
  aiModel: string;
  instructions: string;
}

const CreateSpace = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [spaceData, setSpaceData] = useState<SpaceData>({
    name: "",
    description: "",
    category: "",
    tags: [],
    isPublic: false,
    resourcesVisible: false,
    aiModel: "",
    instructions: ""
  });
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();

  const categories = [
    "Business", "Technology", "Design", "Marketing", "Research", 
    "Education", "Finance", "Healthcare", "Engineering", "Other"
  ];

  const aiModels = [
    {
      id: "gpt-4",
      name: "GPT-4",
      description: "Most capable model for complex reasoning and creativity",
      costPerToken: "$0.03",
      badge: "Popular"
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      description: "Fast and efficient for most tasks",
      costPerToken: "$0.002",
      badge: "Economical"
    },
    {
      id: "claude-3",
      name: "Claude 3 Opus",
      description: "Excellent for analysis and detailed responses",
      costPerToken: "$0.015",
      badge: "Analytical"
    },
    {
      id: "gemini-pro",
      name: "Gemini Pro",
      description: "Google's advanced AI with multimodal capabilities",
      costPerToken: "$0.001",
      badge: "Multimodal"
    }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !spaceData.tags.includes(tagInput.trim())) {
      setSpaceData({
        ...spaceData,
        tags: [...spaceData.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSpaceData({
      ...spaceData,
      tags: spaceData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleCreateSpace = () => {
    toast({
      title: "Space created successfully!",
      description: `${spaceData.name} is ready for collaboration.`,
    });
    // In a real app, redirect to the new space
  };

  const canProceedStep1 = spaceData.name.trim() && spaceData.description.trim() && spaceData.category;
  const canProceedStep2 = true; // Always can proceed from step 2
  const canCreateSpace = spaceData.aiModel;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Create Space</span>
          </div>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8 space-y-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">Create New Space</h1>
              <p className="text-muted-foreground">
                Set up your AI-powered collaborative workspace
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {currentStep} of 3</span>
                <span>{Math.round((currentStep / 3) * 100)}% complete</span>
              </div>
              <Progress value={(currentStep / 3) * 100} className="h-2" />
            </div>

            <div className="flex justify-between">
              <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'
                }`}>
                  {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
                </div>
                <span className="text-sm font-medium">General Info</span>
              </div>
              
              <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'
                }`}>
                  {currentStep > 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
                </div>
                <span className="text-sm font-medium">Visibility</span>
              </div>
              
              <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 3 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'
                }`}>
                  3
                </div>
                <span className="text-sm font-medium">AI Setup</span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <Card className="shadow-elegant border-border/50 animate-fade-in">
            {/* Step 1: General Information */}
            {currentStep === 1 && (
              <>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Info className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">General Information</CardTitle>
                      <CardDescription>
                        Set up the basic details for your space
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Space Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter space name"
                      value={spaceData.name}
                      onChange={(e) => setSpaceData({...spaceData, name: e.target.value})}
                      className="h-12 border-border/50 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this space is for..."
                      value={spaceData.description}
                      onChange={(e) => setSpaceData({...spaceData, description: e.target.value})}
                      className="min-h-[100px] border-border/50 focus:border-primary resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category *
                    </Label>
                    <Select value={spaceData.category} onValueChange={(value) => setSpaceData({...spaceData, category: value})}>
                      <SelectTrigger className="h-12 border-border/50">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-medium">
                      Tags
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="tags"
                        placeholder="Add a tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        className="h-10 border-border/50 focus:border-primary"
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline" className="h-10">
                        Add
                      </Button>
                    </div>
                    
                    {spaceData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {spaceData.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 2: Visibility Settings */}
            {currentStep === 2 && (
              <>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Visibility Settings</CardTitle>
                      <CardDescription>
                        Configure who can access your space and resources
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Space Visibility */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          spaceData.isPublic ? 'bg-success/10' : 'bg-warning/10'
                        }`}>
                          {spaceData.isPublic ? (
                            <Globe className="w-5 h-5 text-success" />
                          ) : (
                            <Lock className="w-5 h-5 text-warning" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">Space Visibility</h3>
                          <p className="text-sm text-muted-foreground">
                            {spaceData.isPublic 
                              ? "Anyone can discover and join this space"
                              : "Only invited members can access this space"
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={spaceData.isPublic ? "default" : "secondary"}>
                          {spaceData.isPublic ? "Public" : "Private"}
                        </Badge>
                        <Switch
                          checked={spaceData.isPublic}
                          onCheckedChange={(checked) => setSpaceData({...spaceData, isPublic: checked})}
                        />
                      </div>
                    </div>

                    {/* Impact Summary */}
                    <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                      <h4 className="font-medium text-foreground flex items-center space-x-2">
                        <Info className="w-4 h-4 text-primary" />
                        <span>Impact of your choice:</span>
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                        {spaceData.isPublic ? (
                          <>
                            <li>• Space will appear in public discovery</li>
                            <li>• Anyone can join without invitation</li>
                            <li>• Existing members keep their current permissions</li>
                            <li>• You remain the owner with full control</li>
                          </>
                        ) : (
                          <>
                            <li>• Space will be hidden from public discovery</li>
                            <li>• Only invited members can join</li>
                            <li>• Existing members keep their current permissions</li>
                            <li>• You control all invitations as owner</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Resource Visibility */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          spaceData.resourcesVisible ? 'bg-primary/10' : 'bg-muted'
                        }`}>
                          <FileText className={`w-5 h-5 ${spaceData.resourcesVisible ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">Resource Visibility</h3>
                          <p className="text-sm text-muted-foreground">
                            {spaceData.resourcesVisible 
                              ? "Documents and files are visible to all members"
                              : "Documents are only visible to collaborators"
                            }
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={spaceData.resourcesVisible}
                        onCheckedChange={(checked) => setSpaceData({...spaceData, resourcesVisible: checked})}
                      />
                    </div>
                  </div>

                  {/* Owner Badge */}
                  <div className="flex items-center justify-center p-4 bg-gradient-card rounded-lg border border-border/50">
                    <div className="flex items-center space-x-3">
                      <Crown className="w-5 h-5 text-warning" />
                      <span className="font-medium text-foreground">You will be the owner of this space</span>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 3: AI Model Selection */}
            {currentStep === 3 && (
              <>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                      <Bot className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">AI Configuration</CardTitle>
                      <CardDescription>
                        Choose your default AI model and set initial instructions
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* AI Model Selection */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Default AI Model *</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {aiModels.map((model) => (
                        <div
                          key={model.id}
                          className={`relative p-4 border rounded-lg cursor-pointer transition-all hover:shadow-card ${
                            spaceData.aiModel === model.id
                              ? 'border-primary bg-primary/5 shadow-card'
                              : 'border-border/50 hover:border-primary/50'
                          }`}
                          onClick={() => setSpaceData({...spaceData, aiModel: model.id})}
                        >
                          {model.badge && (
                            <Badge className="absolute -top-2 -right-2 bg-gradient-primary text-primary-foreground">
                              {model.badge}
                            </Badge>
                          )}
                          
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                spaceData.aiModel === model.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                              }`}>
                                <Sparkles className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{model.name}</h3>
                                <p className="text-sm text-primary font-medium">{model.costPerToken}/1K tokens</p>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {model.description}
                            </p>
                          </div>
                          
                          {spaceData.aiModel === model.id && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Instructions */}
                  <div className="space-y-2">
                    <Label htmlFor="instructions" className="text-sm font-medium">
                      Initial AI Instructions
                    </Label>
                    <Textarea
                      id="instructions"
                      placeholder="Provide context or specific instructions for how the AI should behave in this space..."
                      value={spaceData.instructions}
                      onChange={(e) => setSpaceData({...spaceData, instructions: e.target.value})}
                      className="min-h-[120px] border-border/50 focus:border-primary resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      These instructions will be applied to all AI interactions in this space. You can modify them anytime.
                    </p>
                  </div>
                </CardContent>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between p-6 border-t border-border/50 bg-muted/20">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !canProceedStep1) ||
                    (currentStep === 2 && !canProceedStep2)
                  }
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleCreateSpace}
                  disabled={!canCreateSpace}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Create Space</span>
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateSpace;