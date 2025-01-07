import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Brain, ChartBar, AlertCircle } from "lucide-react";
import { analyzeDocument, DocumentAnalysis } from "@/lib/ai/documentAI";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export const DocumentAnalytics = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: analysis, isLoading } = useQuery({
    queryKey: ['documentAnalysis', selectedDocument],
    queryFn: () => analyzeDocument(selectedDocument || ''),
    enabled: !!selectedDocument,
  });

  const handleAnalyze = async () => {
    setSelectedDocument("Sample document content");
    toast({
      title: "Analysis Started",
      description: "AI is analyzing your document...",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Document Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleAnalyze}
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            <FileText className="mr-2 h-4 w-4" />
            Analyze Document
          </Button>

          {isLoading && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Brain className="h-6 w-6 animate-pulse" />
                <span>Processing document...</span>
              </div>
              <Progress value={45} className="w-full" />
            </div>
          )}

          {analysis && (
            <div className="space-y-6">
              <div className="glass-card p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <ChartBar className="h-4 w-4 text-primary" />
                  Summary
                </h4>
                <p className="text-sm text-muted-foreground">{analysis.summary}</p>
              </div>
              
              <div className="glass-card p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  Key Points
                </h4>
                <ul className="list-disc pl-4 space-y-2">
                  {analysis.keyPoints.map((point, index) => (
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
                  {analysis.suggestedActions.map((action, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};