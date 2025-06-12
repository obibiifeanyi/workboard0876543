import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText } from "lucide-react";

export const AIDocumentAnalyzerPage = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setAnalysisResult("");
    }
  };

  const handleAnalyzeDocument = async () => {
    if (!selectedFile) {
      alert("Please select a document to analyze.");
      return;
    }

    setLoading(true);
    setAnalysisResult("Analyzing document...");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockAnalysis = `Analysis Report for ${selectedFile.name}:

    - Key entities identified: Company A, Project X, John Doe
    - Summarized content: This document outlines the project scope and resource allocation for the upcoming quarter.
    - Potential risks: High dependency on external vendors for certain components.
    - Actionable insights: Prioritize vendor diversification.`;

    setAnalysisResult(mockAnalysis);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">AI Document Analyzer</h2>

      <Card>
        <CardHeader>
          <CardTitle>Upload Document for Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input type="file" onChange={handleFileChange} className="flex-1" />
            <Button onClick={handleAnalyzeDocument} disabled={!selectedFile || loading}>
              {loading ? "Analyzing..." : "Analyze Document"}
              <FileText className="ml-2 h-4 w-4" />
            </Button>
          </div>
          {selectedFile && (
            <p className="text-sm text-muted-foreground">Selected file: <span className="font-semibold">{selectedFile.name}</span></p>
          )}
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Analysis Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={analysisResult}
              readOnly
              rows={10}
              className="font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 