import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileText, Eye, AlertCircle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DocumentService } from "@/services/documentService";
import { DocumentAnalysis } from "@/lib/ai/documentAI";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const DocumentAnalysisHistory = () => {
  const [analyses, setAnalyses] = useState<DocumentAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchAnalysisHistory();
    }
  }, [user]);

  const fetchAnalysisHistory = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await DocumentService.getDocumentAnalyses(user.id);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch analysis history");
      }
      
      setAnalyses(result.data || []);
    } catch (err: any) {
      console.error("Error fetching analysis history:", err);
      setError(err.message || "Failed to fetch analysis history");
      toast({
        title: "Error",
        description: "Failed to load document analysis history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const viewAnalysis = (analysis: DocumentAnalysis) => {
    // This would typically navigate to a detailed view
    // For now, we'll just show a toast
    toast({
      title: "View Analysis",
      description: `Viewing analysis for ${analysis.file_name}`,
    });
  };

  const getDocumentTypeIcon = (analysis: DocumentAnalysis) => {
    const fileType = analysis.file_type || "";
    return DocumentService.getFileIcon(fileType);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Recent Document Analyses
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchAnalysisHistory}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            "Refresh"
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchAnalysisHistory}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : analyses.length > 0 ? (
          <div className="space-y-3">
            {analyses.map((analysis) => (
              <div 
                key={analysis.id} 
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center bg-primary/10 rounded-md text-primary">
                    <span className="text-lg">{getDocumentTypeIcon(analysis)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm line-clamp-1">{analysis.file_name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(analysis.created_at)}
                      </p>
                      {analysis.document_type && (
                        <Badge variant="outline" className="text-xs">
                          {analysis.document_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => viewAnalysis(analysis)}
                  className="ml-2"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No document analyses found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Upload and analyze documents to see them here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
