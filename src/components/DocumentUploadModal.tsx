import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Check, X, File } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceId?: string;
  onUploadComplete?: () => void;
}

export const DocumentUploadModal = ({ open, onOpenChange, spaceId, onUploadComplete }: DocumentUploadModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || 'unknown';
  };

  const handleUpload = async () => {
    if (files.length === 0 || !spaceId || !user) {
      toast({ title: "Erreur", description: "Sélectionnez des fichiers et assurez-vous d'être connecté.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    let successCount = 0;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFile(file.name);
        setUploadProgress(Math.round(((i) / files.length) * 100));

        const fileExt = getFileExtension(file.name);
        const storagePath = `${spaceId}/${Date.now()}-${file.name}`;

        // 1. Upload to storage
        const { error: storageError } = await supabase.storage
          .from('space-documents')
          .upload(storagePath, file);

        if (storageError) {
          console.error(`Storage upload error for ${file.name}:`, storageError);
          toast({ title: "Erreur", description: `Échec de l'upload de ${file.name}`, variant: "destructive" });
          continue;
        }

        // 2. Insert document record
        const { data: docRecord, error: docError } = await supabase
          .from('documents')
          .insert({
            space_id: spaceId,
            name: file.name,
            type: fileExt,
            size_bytes: file.size,
            storage_path: storagePath,
            uploaded_by: user.id,
            status: 'uploaded',
          })
          .select()
          .single();

        if (docError || !docRecord) {
          console.error(`Doc insert error for ${file.name}:`, docError);
          continue;
        }

        // 3. Trigger processing edge function
        try {
          const processResp = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-document`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ documentId: docRecord.id }),
            }
          );
          if (!processResp.ok) {
            console.error(`Process error for ${file.name}:`, await processResp.text());
          }
        } catch (e) {
          console.error(`Process fetch error for ${file.name}:`, e);
        }

        successCount++;
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      if (successCount > 0) {
        toast({
          title: "Documents uploadés",
          description: `${successCount}/${files.length} document(s) uploadé(s) et en cours de traitement.`,
        });
        onUploadComplete?.();
      }

      setFiles([]);
      setUploadProgress(0);
      setCurrentFile("");
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Upload className="w-6 h-6 text-primary" />
            Uploader des documents
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Drag & Drop Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Glissez vos fichiers ici</p>
            <p className="text-sm text-muted-foreground mb-4">ou</p>
            <Label htmlFor="file-upload-modal">
              <Button variant="outline" asChild>
                <span className="cursor-pointer">Sélectionner des fichiers</span>
              </Button>
            </Label>
            <Input
              id="file-upload-modal"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.md,.csv,.json,.xml,.html,.xls,.xlsx,.ppt,.pptx"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Formats : PDF, Word, Excel, PowerPoint, TXT, Markdown, CSV, JSON, XML, HTML</p>
            <p>Taille max : 20 Mo par fichier</p>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Fichiers sélectionnés ({files.length}):</Label>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <File className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} Mo
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={isUploading}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="truncate max-w-[300px]">{currentFile}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Traitement en cours...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Uploader {files.length > 0 ? `(${files.length})` : ""}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
