import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  FileText, 
  Download, 
  ExternalLink,
  Search,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface DocumentPreviewProps {
  document: {
    id: string;
    name: string;
    type: string;
    size: string;
    content?: string;
  };
  onClose: () => void;
}

export const DocumentPreview = ({ document, onClose }: DocumentPreviewProps) => {
  const [zoom, setZoom] = useState(100);
  const { t } = useLanguage();

  // Mock content for demonstration
  const mockContent = `
    # ${document.name}
    
    ## Executive Summary
    This document contains important information about our research findings and recommendations for future development.
    
    ## Key Findings
    1. **Performance Metrics**: Our analysis shows significant improvements in user engagement
    2. **User Feedback**: 89% of users reported positive experiences with the new features  
    3. **Technical Analysis**: System performance improved by 34% after optimizations
    
    ## Detailed Analysis
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
    
    ### Section 1: Methodology
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    
    ### Section 2: Results
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
    
    ## Recommendations
    1. Continue monitoring user feedback
    2. Implement additional performance optimizations
    3. Expand feature set based on user requests
    
    ## Conclusion
    The results demonstrate significant progress and provide a solid foundation for future development initiatives.
  `;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[90vh] bg-background border-border/50 flex flex-col">
        <CardHeader className="flex-shrink-0 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {document.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {document.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {document.size}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-xs text-muted-foreground px-2 min-w-[3rem] text-center">
                  {zoom}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
              
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            <div 
              className="p-6 prose prose-sm max-w-none dark:prose-invert"
              style={{ 
                fontSize: `${zoom}%`,
                lineHeight: '1.6'
              }}
            >
              <div className="whitespace-pre-wrap font-mono text-sm">
                {document.content || mockContent}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};