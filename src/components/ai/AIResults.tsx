import { useAIOperations } from "@/hooks/useAIOperations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AIResults = () => {
  const { useAIResults } = useAIOperations();
  const { data: results, isLoading } = useAIResults();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {results?.map((result) => (
              <Card key={result.id} className="p-4 bg-muted/50">
                <p className="font-medium mb-2">{result.query_text}</p>
                <div className="text-sm text-muted-foreground">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(result.result_data, null, 2)}
                  </pre>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Model: {result.model_used}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};