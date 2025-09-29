import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Settings, 
  Users, 
  Link as LinkIcon, 
  Copy, 
  Share, 
  Trash2, 
  Crown, 
  Shield,
  Globe,
  Lock,
  UserPlus,
  X,
  Bot,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { spaceService } from "@/services/spaceService";

interface SpaceSettingsProps {
  space: {
    id: string;
    name: string;
    description: string;
    visibility: 'public' | 'private';
    aiModel: string;
    owner: { name: string; avatar: string };
    stats: { members: number; documents: number; messages: number };
    isOwner: boolean;
  };
  onClose?: () => void;
}

export const SpaceSettings = ({ space, onClose }: SpaceSettingsProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: space.name,
    description: space.description,
    visibility: space.visibility,
    aiModel: space.aiModel
  });
  const [availableModels] = useState(spaceService.getAvailableAIModels());
  const [members] = useState([
    { id: '1', name: 'Sarah Chen', email: 'sarah@example.com', role: 'owner', avatar: '' },
    { id: '2', name: 'Alex Rodriguez', email: 'alex@example.com', role: 'admin', avatar: '' },
    { id: '3', name: 'Emma Thompson', email: 'emma@example.com', role: 'member', avatar: '' },
  ]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  const generateInviteLink = async () => {
    try {
      const shareLink = await spaceService.generateShareLink(space.id);
      navigator.clipboard.writeText(shareLink.url);
      toast({
        title: t("settings.linkCopied"),
        description: t("settings.linkCopiedDesc"),
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le lien d'invitation.",
        variant: "destructive"
      });
    }
  };

  const sendEmailInvite = async () => {
    if (!inviteEmail) return;
    try {
      await spaceService.sendInviteEmail(space.id, inviteEmail, inviteRole);
      toast({
        title: t("settings.inviteSent"),
        description: t("settings.inviteSentDesc", { email: inviteEmail }),
      });
      setInviteEmail("");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'invitation.",
        variant: "destructive"
      });
    }
  };

  const updateSpaceSettings = async () => {
    try {
      await spaceService.updateSpaceSettings(space.id, formData);
      toast({
        title: t("settings.settingsUpdated"),
        description: t("settings.settingsUpdatedDesc"),
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres.",
        variant: "destructive"
      });
    }
  };

  const deleteSpace = () => {
    toast({
      title: "Espace supprimé",
      description: "L'espace sera définitivement supprimé dans 30 jours.",
      variant: "destructive"
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-warning" />;
      case 'admin': return <Shield className="w-4 h-4 text-primary" />;
      default: return <Users className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'Propriétaire';
      case 'admin': return 'Administrateur';
      default: return 'Membre';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Paramètres de l'espace</h1>
            <p className="text-muted-foreground">{space.name}</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Modifiez les informations de base de votre espace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'espace</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="border-border/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="border-border/50 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiModel">{t("settings.aiModel")}</Label>
                <Select value={formData.aiModel} onValueChange={(value) => setFormData(prev => ({ ...prev, aiModel: value }))}>
                  <SelectTrigger className="border-border/50">
                    <SelectValue placeholder={t("settings.selectModel")} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{model.name}</div>
                            <div className="text-xs text-muted-foreground">{model.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="space-y-1">
                  <Label>{t("settings.visibility")}</Label>
                  <div className="flex items-center space-x-2">
                    {formData.visibility === 'public' ? (
                      <>
                        <Globe className="w-4 h-4 text-success" />
                        <span className="text-sm text-muted-foreground">{t("settings.publicDesc")}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-warning" />
                        <span className="text-sm text-muted-foreground">{t("settings.privateDesc")}</span>
                      </>
                    )}
                  </div>
                </div>
                <Switch 
                  checked={formData.visibility === 'public'}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, visibility: checked ? 'public' : 'private' }))
                  }
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={updateSpaceSettings} className="bg-gradient-primary">
                  Sauvegarder les modifications
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Members Management */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Membres ({members.length})</span>
              </CardTitle>
              <CardDescription>
                Gérez les membres et leurs permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-sm text-primary-foreground">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        {getRoleIcon(member.role)}
                        <span>{getRoleLabel(member.role)}</span>
                      </Badge>
                      {member.role !== 'owner' && space.isOwner && (
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          {space.isOwner && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive">Zone de danger</CardTitle>
                <CardDescription>
                  Actions irréversibles sur cet espace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer cet espace
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Êtes-vous sûr ?</DialogTitle>
                      <DialogDescription>
                        Cette action supprimera définitivement l'espace "{space.name}" et toutes ses données.
                        Cette action peut être annulée dans les 30 jours.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Annuler</Button>
                      <Button variant="destructive" onClick={deleteSpace}>
                        Supprimer définitivement
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Invite Members */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <span>Inviter des membres</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemple.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="border-border/50"
                />
              </div>
              
              <Button onClick={sendEmailInvite} className="w-full" disabled={!inviteEmail}>
                <UserPlus className="w-4 h-4 mr-2" />
                Envoyer l'invitation
              </Button>

              <Separator />

              <div className="space-y-2">
                <Label>Lien d'invitation</Label>
                <p className="text-sm text-muted-foreground">
                  Partagez ce lien pour inviter des membres
                </p>
                <Button onClick={generateInviteLink} variant="outline" className="w-full">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Copier le lien
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Space Stats */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Membres</span>
                <span className="font-medium">{space.stats.members}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Documents</span>
                <span className="font-medium">{space.stats.documents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Messages</span>
                <span className="font-medium">{space.stats.messages}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={generateInviteLink}>
                <Share className="w-4 h-4 mr-2" />
                {t("settings.shareSpace")}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                {t("settings.openInNew")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};