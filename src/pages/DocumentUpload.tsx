import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  File, 
  Link as LinkIcon, 
  X, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Cloud,
  HardDrive
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
}

const DocumentUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const supportedFormats = [
    { type: "PDF", icon: FileText, description: "Portable Document Format" },
    { type: "DOC/DOCX", icon: FileText, description: "Microsoft Word Documents" },
    { type: "TXT", icon: File, description: "Plain Text Files" },
    { type: "XLSX", icon: FileText, description: "Microsoft Excel Spreadsheets" },
    { type: "PPT/PPTX", icon: FileText, description: "Microsoft PowerPoint" },
    { type: "URL", icon: LinkIcon, description: "Web Pages and Links" }
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFileUpload(selectedFiles);
    }
  };

  const handleFileUpload = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type || file.name.split('.').pop()?.toUpperCase() || 'Unknown',
      status: 'uploading' as const,
      progress: 0
    }));

    // Check file size limit (50MB)
    const oversizedFiles = newFiles.filter(file => file.size > 50 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: `Files must be under 50MB. ${oversizedFiles.length} file(s) rejected.`,
        variant: "destructive"
      });
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(file => {
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            const newProgress = Math.min(f.progress + Math.random() * 20, 100);
            const status = newProgress === 100 ? 'completed' : 'uploading';
            
            if (status === 'completed') {
              clearInterval(interval);
              toast({
                title: "Upload successful",
                description: `${file.name} has been added to the knowledge base.`,
              });
            }
            
            return { ...f, progress: newProgress, status };
          }
          return f;
        }));
      }, 300);
    });
  };

  const handleUrlUpload = () => {
    if (!urlInput.trim()) return;

    try {
      new URL(urlInput); // Validate URL
      
      const urlFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: urlInput,
        size: 0,
        type: 'URL',
        status: 'uploading',
        progress: 0
      };

      setFiles(prev => [...prev, urlFile]);
      setUrlInput("");

      // Simulate URL processing
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === urlFile.id) {
            const newProgress = Math.min(f.progress + Math.random() * 25, 100);
            const status = newProgress === 100 ? 'completed' : 'uploading';
            
            if (status === 'completed') {
              clearInterval(interval);
              toast({
                title: "URL processed",
                description: "Web content has been extracted and added to knowledge base.",
              });
            }
            
            return { ...f, progress: newProgress, status };
          }
          return f;
        }));
      }, 400);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid web address.",
        variant: "destructive"
      });
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
            <Upload className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Upload Documents</span>
          </div>
          
          <div className="w-32"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Upload Documents</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Add documents to your knowledge base. AI will automatically process and index them for intelligent search and conversation.
            </p>
          </div>

          {/* Supported Formats */}
          <Card className="shadow-elegant border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Supported Formats</span>
              </CardTitle>
              <CardDescription>
                Maximum file size: 50MB per file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {supportedFormats.map((format) => (
                  <div key={format.type} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <format.icon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{format.type}</p>
                      <p className="text-xs text-muted-foreground">{format.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload Area */}
          <Card className="shadow-elegant border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-accent" />
                <span>Upload Files</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                  isDragOver 
                    ? 'border-primary bg-primary/5 scale-105' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {isDragOver ? 'Drop your files here' : 'Drag & drop your files'}
                    </h3>
                    <p className="text-muted-foreground">
                      or click to select files from your computer
                    </p>
                  </div>

                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.xlsx,.ppt,.pptx"
                  />
                  <label htmlFor="file-upload">
                    <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                      <HardDrive className="w-4 h-4 mr-2" />
                      Select Files
                    </Button>
                  </label>
                </div>
              </div>

              {/* URL Upload */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Add from URL</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="https://example.com/document"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 h-12 border-border/50 focus:border-primary"
                    onKeyPress={(e) => e.key === 'Enter' && handleUrlUpload()}
                  />
                  <Button 
                    onClick={handleUrlUpload}
                    variant="outline"
                    className="h-12 px-6"
                    disabled={!urlInput.trim()}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Add URL
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Progress */}
          {files.length > 0 && (
            <Card className="shadow-elegant border-border/50 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Upload Progress</span>
                  <Badge variant="outline">
                    {files.filter(f => f.status === 'completed').length} / {files.length} completed
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center space-x-4 p-4 border border-border/50 rounded-lg">
                      <div className="flex-shrink-0">
                        {file.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-success" />
                        ) : file.status === 'error' ? (
                          <AlertCircle className="w-6 h-6 text-destructive" />
                        ) : (
                          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground truncate max-w-md">
                              {file.name}
                            </p>
                            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                              <span>{file.type}</span>
                              {file.size > 0 && <span>{formatFileSize(file.size)}</span>}
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {file.status === 'uploading' && (
                          <div className="space-y-1">
                            <Progress value={file.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              {Math.round(file.progress)}% completed
                            </p>
                          </div>
                        )}
                        
                        {file.status === 'completed' && (
                          <Badge variant="outline" className="text-success border-success/20 bg-success/5">
                            Added to knowledge base
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;