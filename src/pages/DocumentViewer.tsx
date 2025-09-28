import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Download, 
  Eye, 
  ArrowLeft,
  FileText,
  File,
  Link as LinkIcon,
  Globe,
  Lock,
  Calendar,
  User,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ViewableDocument {
  id: string;
  name: string;
  type: 'PDF' | 'DOC' | 'TXT' | 'XLSX' | 'PPT' | 'URL';
  size: number;
  uploadDate: string;
  uploadedBy: string;
  visibility: 'public' | 'private';
  downloadCount: number;
  description?: string;
  preview?: string;
  url?: string;
}

const DocumentViewer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Mock accessible documents (documents user can view)
  const accessibleDocuments: ViewableDocument[] = [
    {
      id: "1",
      name: "Product Requirements Document.pdf",
      type: "PDF",
      size: 2048576,
      uploadDate: "2024-01-15",
      uploadedBy: "Sarah Chen",
      visibility: "public",
      downloadCount: 24,
      description: "Comprehensive PRD for Q2 feature development",
      preview: "This document outlines the product requirements for the upcoming Q2 features including user authentication, dashboard improvements, and API integrations..."
    },
    {
      id: "3",
      name: "Design System Guidelines.doc",
      type: "DOC", 
      size: 3072000,
      uploadDate: "2024-01-10",
      uploadedBy: "Alex Rivera",
      visibility: "public",
      downloadCount: 45,
      description: "Complete design system documentation",
      preview: "Design System Guidelines\n\n1. Color Palette\n- Primary: #3B82F6\n- Secondary: #64748B\n- Accent: #8B5CF6\n\n2. Typography\n- Headings: Inter Bold\n- Body: Inter Regular..."
    },
    {
      id: "5",
      name: "AI Research Paper - GPT Models",
      type: "URL",
      size: 0,
      uploadDate: "2024-01-05",
      uploadedBy: "Dr. Lisa Park",
      visibility: "public", 
      downloadCount: 67,
      description: "Latest research on large language models",
      url: "https://arxiv.org/abs/2023.12345",
      preview: "Abstract: This paper presents a comprehensive analysis of modern large language models, focusing on architectural improvements and training methodologies..."
    },
    {
      id: "6",
      name: "Team Meeting Notes - January.txt",
      type: "TXT",
      size: 4096,
      uploadDate: "2024-01-20",
      uploadedBy: "Mike Johnson",
      visibility: "public",
      downloadCount: 12,
      description: "Monthly team sync meeting notes",
      preview: "Team Meeting Notes - January 2024\n\nAttendees: Sarah, Mike, Alex, Lisa\n\nAgenda:\n1. Q4 Review\n2. Q1 Planning\n3. New team member onboarding\n\nAction Items:\n- Sarah: Finalize Q1 roadmap by Friday..."
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'URL': return LinkIcon;
      case 'PDF': return FileText;
      case 'DOC': return FileText;
      case 'TXT': return File;
      case 'XLSX': return FileText;
      case 'PPT': return FileText;
      default: return File;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Web Link';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = (doc: ViewableDocument) => {
    toast({
      title: "Download started", 
      description: `${doc.name} is being downloaded.`,
    });
  };

  const handleExternalLink = (doc: ViewableDocument) => {
    if (doc.url) {
      window.open(doc.url, '_blank');
      toast({
        title: "Opening external link",
        description: `${doc.name} will open in a new tab.`,
      });
    }
  };

  const filteredDocuments = accessibleDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Eye className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold text-foreground">Document Viewer</span>
          </div>
          
          <div className="w-32"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Accessible Documents</h1>
            <p className="text-muted-foreground">
              View and download documents you have access to
            </p>
          </div>

          {/* Search */}
          <Card className="shadow-elegant border-border/50">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search accessible documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-border/50 focus:border-primary"
                />
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <span>
                  Showing {filteredDocuments.length} of {accessibleDocuments.length} accessible documents
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Documents Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredDocuments.map((doc) => {
              const FileIcon = getFileIcon(doc.type);
              
              return (
                <Card key={doc.id} className="shadow-card border-border/50 hover:shadow-elegant transition-all animate-fade-in group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <FileIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <CardTitle className="text-lg leading-tight">
                            {doc.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant={doc.visibility === 'public' ? 'default' : 'secondary'} className="text-xs">
                              {doc.visibility === 'public' ? (
                                <><Globe className="w-2 h-2 mr-1" /> Public</>
                              ) : (
                                <><Lock className="w-2 h-2 mr-1" /> Private</>
                              )}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-muted/30">
                              {doc.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {doc.description && (
                      <CardDescription className="mt-3">
                        {doc.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Document Info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(doc.uploadDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{doc.uploadedBy}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="w-3 h-3" />
                        <span>{formatFileSize(doc.size)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-3 h-3" />
                        <span>{doc.downloadCount} downloads</span>
                      </div>
                    </div>

                    {/* Preview */}
                    {doc.preview && (
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-foreground mb-2">Preview</h4>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {doc.preview}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                        className="flex-1 hover:bg-primary/5 hover:border-primary/50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      
                      {doc.type === 'URL' && doc.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExternalLink(doc)}
                          className="flex-1 hover:bg-accent/5 hover:border-accent/50"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Link
                        </Button>
                      )}
                      
                      {doc.type !== 'URL' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-success/5 hover:border-success/50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Quick View
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredDocuments.length === 0 && (
            <Card className="shadow-card border-border/50">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No accessible documents found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? "Try adjusting your search query." 
                    : "You don't have access to any documents yet. Join spaces or get invited to view shared documents."}
                </p>
                <Link to="/spaces/discover">
                  <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                    Discover Public Spaces
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;