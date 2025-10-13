import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Users,
  Settings,
  Share2,
  Clock,
  Tag,
  Upload,
  Plus,
  X,
  File,
  Loader2,
  Copy,
  Mail,
  Link as LinkIcon
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";

interface SpaceDetailsSidebarProps {
  space: {
    id: string;
    name: string;
    category: string;
    description: string;
    tags: string[];
    visibility: 'public' | 'private';
    lastActivity: string;
  };
  documents: Array<{
    id: string;
    name: string;
    size: string;
    uploadedAt: string;
  }>;
  members: Array<{
    id: string;
    name: string;
    avatar?: string;
    role: string;
  }>;
  onShare: () => void;
}

export function SpaceDetailsSidebar({ space, documents, members, onShare }: SpaceDetailsSidebarProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [showSettings, setShowSettings] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [spaceName, setSpaceName] = useState(space.name);
  const [spaceDescription, setSpaceDescription] = useState(space.description);
  const [spaceVisibility, setSpaceVisibility] = useState<'public' | 'private'>(space.visibility);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;
    
    setUploading(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Documents uploadés",
      description: `${uploadFiles.length} document(s) ajouté(s) avec succès`,
    });
    
    setUploadFiles([]);
    setShowUpload(false);
    setUploading(false);
  };

  const removeFile = (index: number) => {
    setUploadFiles(files => files.filter((_, i) => i !== index));
  };

  const handleShareLink = () => {
    const shareLink = `${window.location.origin}/spaces/join/${space.id}`;
    navigator.clipboard.writeText(shareLink);
    toast({
      title: t("settings.linkCopied"),
      description: t("settings.linkCopiedDesc"),
    });
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    
    // Simulate sending invite
    toast({
      title: t("settings.inviteSent"),
      description: t("settings.inviteSentDesc", { email: inviteEmail }),
    });
    
    setInviteEmail("");
    setShowInvite(false);
  };

  const handleSaveSettings = () => {
    // Simulate saving settings
    toast({
      title: t("settings.settingsUpdated"),
      description: t("settings.settingsUpdatedDesc"),
    });
    setShowSettings(false);
  };

  return (
    <div className="w-80 border-l border-border/50 bg-background/50 backdrop-blur-sm flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground truncate">{space.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {space.category}
          </Badge>
          <Badge variant={space.visibility === 'public' ? 'default' : 'outline'} className="text-xs">
            {space.visibility === 'public' ? 'Public' : 'Privé'}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="w-3 h-3 mr-1" />
                {t("chat.settings")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t("spaces.settings.title")}</DialogTitle>
                <DialogDescription>
                  {t("settings.settingsUpdatedDesc")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="space-name">{t("spaces.name")}</Label>
                  <Input
                    id="space-name"
                    value={spaceName}
                    onChange={(e) => setSpaceName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="space-description">{t("spaces.description")}</Label>
                  <Textarea
                    id="space-description"
                    value={spaceDescription}
                    onChange={(e) => setSpaceDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("settings.visibility")}</Label>
                  <Select value={spaceVisibility} onValueChange={(value: 'public' | 'private') => setSpaceVisibility(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">{t("spaces.public")}</SelectItem>
                      <SelectItem value="private">{t("spaces.private")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  {t("common.cancel")}
                </Button>
                <Button onClick={handleSaveSettings} className="bg-gradient-primary">
                  {t("common.save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm" onClick={handleShareLink} className="flex-1">
            <Share2 className="w-3 h-3 mr-1" />
            {t("common.share")}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 px-4 pt-2">
          <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">Documents</TabsTrigger>
          <TabsTrigger value="members" className="text-xs">Équipe</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <TabsContent value="info" className="mt-0 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{space.description}</p>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {space.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Activité</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Dernière activité: {typeof space.lastActivity === 'string' ? space.lastActivity : new Date(space.lastActivity).toLocaleString()}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Statistiques</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Documents</span>
                    <span className="font-medium text-foreground">{documents.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Membres</span>
                    <span className="font-medium text-foreground">{members.length}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-0 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">
                  {documents.length} document(s)
                </h4>
                <Dialog open={showUpload} onOpenChange={setShowUpload}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Upload className="w-3 h-3 mr-1" />
                      Ajouter
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Ajouter des documents</DialogTitle>
                      <DialogDescription>
                        Uploadez des documents pour enrichir la base de connaissances du space
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="file-upload">Sélectionner des fichiers</Label>
                        <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                          <Input
                            id="file-upload"
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Cliquez pour sélectionner des fichiers
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PDF, DOCX, TXT, etc.
                            </p>
                          </label>
                        </div>
                      </div>

                      {uploadFiles.length > 0 && (
                        <div className="space-y-2">
                          <Label>Fichiers sélectionnés ({uploadFiles.length})</Label>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {uploadFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <File className="w-4 h-4 text-primary shrink-0" />
                                  <span className="text-sm truncate">{file.name}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  className="shrink-0 h-6 w-6 p-0"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowUpload(false);
                          setUploadFiles([]);
                        }}
                        className="flex-1"
                        disabled={uploading}
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={handleUpload}
                        disabled={uploadFiles.length === 0 || uploading}
                        className="flex-1 bg-gradient-primary"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Upload...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Uploader
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {documents.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-6 text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Aucun document pour le moment
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-card transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {doc.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{doc.size}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{doc.uploadedAt}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="members" className="mt-0 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">
                  {members.length} {t("chat.members")}
                </h4>
                <Dialog open={showInvite} onOpenChange={setShowInvite}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="w-3 h-3 mr-1" />
                      {t("chat.invite")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{t("spaces.settings.invite")}</DialogTitle>
                      <DialogDescription>
                        {t("spaces.settings.inviteLink")}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="invite-email">{t("auth.email")}</Label>
                        <Input
                          id="invite-email"
                          type="email"
                          placeholder="email@example.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("spaces.settings.permissions")}</Label>
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">{t("spaces.member")}</SelectItem>
                            <SelectItem value="collaborator">{t("spaces.collaborator")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label>{t("settings.shareSpace")}</Label>
                        <div className="flex gap-2">
                          <Input
                            readOnly
                            value={`${window.location.origin}/spaces/join/${space.id}`}
                            className="flex-1"
                          />
                          <Button size="icon" variant="outline" onClick={handleShareLink}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowInvite(false)}>
                        {t("common.cancel")}
                      </Button>
                      <Button onClick={handleInvite} disabled={!inviteEmail.trim()} className="bg-gradient-primary">
                        <Mail className="w-4 h-4 mr-2" />
                        {t("chat.invite")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2">
                {members.map((member) => (
                  <Card key={member.id} className="hover:shadow-card transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium shrink-0">
                          {member.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
