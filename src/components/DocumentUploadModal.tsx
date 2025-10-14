import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Link as LinkIcon,
  Check,
  X,
  File
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceId?: string;
}

export const DocumentUploadModal = ({ open, onOpenChange, spaceId }: DocumentUploadModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0 && !url) {
      toast({
        title: t("common.error"),
        description: t("documents.noFilesSelected"),
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      toast({
        title: t("common.success"),
        description: t("documents.uploadSuccess"),
      });

      // Reset form
      setFiles([]);
      setUrl("");
      setUploadProgress(0);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("documents.uploadError"),
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlUpload = async () => {
    if (!url) {
      toast({
        title: t("common.error"),
        description: t("documents.enterUrl"),
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate URL processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: t("common.success"),
        description: t("documents.urlSuccess"),
      });

      setUrl("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("documents.uploadError"),
        variant: "destructive"
      });
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
            {t("documents.upload")}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="files" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="files">
              <FileText className="w-4 h-4 mr-2" />
              {t("documents.selectFiles")}
            </TabsTrigger>
            <TabsTrigger value="url">
              <LinkIcon className="w-4 h-4 mr-2" />
              {t("documents.addFromUrl")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="space-y-4 mt-4">
            {/* Drag & Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">{t("documents.dragDrop")}</p>
              <p className="text-sm text-muted-foreground mb-4">{t("common.or")}</p>
              <Label htmlFor="file-upload">
                <Button variant="outline" asChild>
                  <span className="cursor-pointer">
                    {t("documents.selectFiles")}
                  </span>
                </Button>
              </Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
              />
            </div>

            {/* File Info */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{t("documents.supportedFormats")}: PDF, Word, Excel, PowerPoint, Text</p>
              <p>{t("documents.maxSize")}</p>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="space-y-2">
                <Label>{t("documents.selectedFiles")}:</Label>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <File className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                    >
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
                  <span>{t("documents.uploadProgress")}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Upload Button */}
            <Button 
              onClick={handleUpload} 
              disabled={isUploading || files.length === 0}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  {t("documents.processing")}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {t("documents.upload")}
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">{t("documents.enterUrl")}</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={t("documents.urlPlaceholder")}
                  className="border-border/50 focus:border-primary"
                  disabled={isUploading}
                />
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>{t("documents.supportedUrlFormats")}</p>
              </div>

              <Button 
                onClick={handleUrlUpload} 
                disabled={isUploading || !url}
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    {t("documents.processing")}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {t("documents.addUrl")}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
