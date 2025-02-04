import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Brain, ChartBar, AlertCircle, Tag, Clock } from "lucide-react";
import { analyzeDocument, DocumentAnalysis } from "@/lib/ai/documentAI";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  content: string;
}

export const DocumentAnalytics = () => {
  const [selectedDocument, setSelectedDocument] = useState<UploadedDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const { data: analysis, isLoading } = useQuery({
    queryKey: ['documentAnalysis', selectedDocument?.id],
    queryFn: () => analyzeDocument(selectedDocument?.content || ''),
    enabled: !!selectedDocument,
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`${Date.now()}-${file.name}`, file);

      if (uploadError) throw uploadError;

      const content = await file.text();

      setSelectedDocument({
        id: uploadData.path,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type,
        content
      });

      toast({
        title: "File Uploaded",
        description: "Your document is ready for analysis",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Document Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="document-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-primary/5"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileText className="w-8 h-8 mb-2 text-primary" />
                <p className="mb-2 text-sm">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOCX, TXT (MAX. 10MB)
                </p>
              </div>
              <input
                id="document-upload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt"
              />
            </label>
          </div>

          {selectedDocument && (
            <div className="glass-card p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium">{selectedDocument.name}</span>
                <span className="text-sm text-muted-foreground">({selectedDocument.size})</span>
              </div>
            </div>
          )}

          {(isUploading || isLoading) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Clock className="h-6 w-6 animate-pulse" />
                <span>{isUploading ? "Uploading document..." : "Processing document..."}</span>
              </div>
              <Progress value={isUploading ? 45 : 75} className="w-full" />
            </div>
          )}

          {analysis?.analysis_result && (
            <div className="space-y-6">
              <div className="glass-card p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <ChartBar className="h-4 w-4 text-primary" />
                  Summary
                </h4>
                <p className="text-sm text-muted-foreground">{analysis.analysis_result.summary}</p>
              </div>
              
              <div className="glass-card p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  Key Points
                </h4>
                <ul className="list-disc pl-4 space-y-2">
                  {analysis.analysis_result.keyPoints.map((point, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Suggested Actions
                </h4>
                <ul className="list-disc pl-4 space-y-2">
                  {analysis.analysis_result.suggestedActions.map((action, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {analysis.analysis_result.categories && (
                <div className="glass-card p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.analysis_result.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full bg-primary/10 text-xs"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};