import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Brain, ChartBar } from "lucide-react";
import { analyzeDocument, DocumentAnalysis } from "@/lib/ai/documentAI";
import { useToast } from "@/hooks/use-toast";

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
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Document Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleAnalyze}
          className="w-full"
          disabled={isLoading}
        >
          <FileText className="mr-2 h-4 w-4" />
          Analyze Document
        </Button>

        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Brain className="h-8 w-8 animate-pulse text-primary" />
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground">{analysis.summary}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Key Points</h4>
              <ul className="list-disc pl-4 space-y-1">
                {analysis.keyPoints.map((point, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Suggested Actions</h4>
              <ul className="list-disc pl-4 space-y-1">
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
  );
};