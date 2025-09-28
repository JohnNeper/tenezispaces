import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  Settings,
  ArrowLeft,
  FileText,
  File,
  Link as LinkIcon,
  Globe,
  Lock,
  Calendar,
  User,
  MoreVertical
} from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'DOC' | 'TXT' | 'XLSX' | 'PPT' | 'URL';
  size: number;
  uploadDate: string;
  uploadedBy: string;
  visibility: 'public' | 'private';
  downloadCount: number;
  description?: string;
}

const DocumentManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterType, setFilterType] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const { toast } = useToast();

  const documents: Document[] = [
    {
      id: "1",
      name: "Product Requirements Document.pdf",
      type: "PDF",
      size: 2048576,
      uploadDate: "2024-01-15",
      uploadedBy: "Sarah Chen",
      visibility: "public",
      downloadCount: 24,
      description: "Comprehensive PRD for Q2 feature development"
    },
    {
      id: "2", 
      name: "Market Research Analysis.xlsx",
      type: "XLSX",
      size: 1536000,
      uploadDate: "2024-01-12",
      uploadedBy: "Mike Johnson",
      visibility: "private",
      downloadCount: 8,
      description: "Q4 market analysis and competitor research"
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
      description: "Complete design system documentation"
    },
    {
      id: "4",
      name: "Meeting Notes - Sprint Planning.txt",
      type: "TXT",
      size: 8192,
      uploadDate: "2024-01-08",
      uploadedBy: "You",
      visibility: "private",
      downloadCount: 3
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
      description: "Latest research on large language models"
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

  const handleDownload = (doc: Document) => {
    toast({
      title: "Download started", 
      description: `${doc.name} is being downloaded.`,
    });
  };

  const handleView = (doc: Document) => {
    toast({
      title: "Opening document",
      description: `${doc.name} will open in a new tab.`,
    });
  };

  const handleDelete = (doc: Document) => {
    toast({
      title: "Document deleted",
      description: `${doc.name} has been removed from the knowledge base.`,
      variant: "destructive"
    });
  };

  const handleVisibilityChange = (doc: Document) => {
    const newVisibility = doc.visibility === 'public' ? 'private' : 'public';
    toast({
      title: "Visibility updated",
      description: `${doc.name} is now ${newVisibility}.`,
    });
  };

  const filteredAndSortedDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || doc.type === filterType;
      const matchesVisibility = filterVisibility === "all" || doc.visibility === filterVisibility;
      
      return matchesSearch && matchesType && matchesVisibility;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return b.size - a.size;
        case "downloads":
          return b.downloadCount - a.downloadCount;
        case "date":
        default:
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
    });

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
            <FileText className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Document Manager</span>
          </div>
          
          <Link to="/documents/upload">
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
              Upload Documents
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Document Manager</h1>
            <p className="text-muted-foreground">
              Manage all documents in your knowledge base
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="shadow-elegant border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-border/50 focus:border-primary"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 h-12 border-border/50">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Upload Date</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="size">File Size</SelectItem>
                      <SelectItem value="downloads">Downloads</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-32 h-12 border-border/50">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="DOC">DOC</SelectItem>
                      <SelectItem value="TXT">TXT</SelectItem>
                      <SelectItem value="XLSX">XLSX</SelectItem>
                      <SelectItem value="PPT">PPT</SelectItem>
                      <SelectItem value="URL">URL</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterVisibility} onValueChange={setFilterVisibility}>
                    <SelectTrigger className="w-32 h-12 border-border/50">
                      <SelectValue placeholder="Visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Summary */}
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing {filteredAndSortedDocuments.length} of {documents.length} documents
                </span>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filters applied</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <div className="space-y-4">
            {filteredAndSortedDocuments.map((doc) => {
              const FileIcon = getFileIcon(doc.type);
              
              return (
                <Card key={doc.id} className="shadow-card border-border/50 hover:shadow-elegant transition-all animate-fade-in">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* File Icon */}
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileIcon className="w-6 h-6 text-primary" />
                        </div>

                        {/* Document Info */}
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-foreground truncate">
                              {doc.name}
                            </h3>
                            <Badge variant={doc.visibility === 'public' ? 'default' : 'secondary'}>
                              {doc.visibility === 'public' ? (
                                <><Globe className="w-3 h-3 mr-1" /> Public</>
                              ) : (
                                <><Lock className="w-3 h-3 mr-1" /> Private</>
                              )}
                            </Badge>
                            <Badge variant="outline" className="bg-muted/30">
                              {doc.type}
                            </Badge>
                          </div>

                          {doc.description && (
                            <p className="text-sm text-muted-foreground">
                              {doc.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
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
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(doc)}
                          className="hover:bg-primary/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                          className="hover:bg-accent/10"
                        >
                          <Download className="w-4 h-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleVisibilityChange(doc)}>
                              <Settings className="w-4 h-4 mr-2" />
                              Change to {doc.visibility === 'public' ? 'Private' : 'Public'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(doc)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Document
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredAndSortedDocuments.length === 0 && (
              <Card className="shadow-card border-border/50">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No documents found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || filterType !== 'all' || filterVisibility !== 'all' 
                      ? "Try adjusting your search or filters." 
                      : "Upload your first document to get started."}
                  </p>
                  <Link to="/documents/upload">
                    <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                      Upload Documents
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManager;