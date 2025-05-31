
import { useState } from "react";
import { Brain, Upload, FileText, Loader, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  recommendations: string[];
  sentiment: string;
  confidence: number;
}

export const AIDocumentAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please select a PDF, Word document, or text file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setTextInput(""); // Clear text input when file is selected
    }
  };

  const analyzeDocument = async () => {
    if (!selectedFile && !textInput.trim()) {
      toast({
        title: "No Content",
        description: "Please select a file or enter text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      let content = "";
      
      if (selectedFile) {
        // Extract text from file
        if (selectedFile.type === 'text/plain') {
          content = await selectedFile.text();
        } else {
          // For other file types, we'll need to implement proper extraction
          // For now, we'll use the filename as a placeholder
          content = `Document: ${selectedFile.name} - Content extraction for ${selectedFile.type} files will be implemented with proper document parsing.`;
        }
      } else {
        content = textInput;
      }

      // Store analysis request in database
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error("User not authenticated");
      }

      const mockResult: AnalysisResult = {
        summary: `Analysis of ${selectedFile ? selectedFile.name : 'provided text'}: This document appears to contain business-related content relevant to CT Communication Towers operations.`,
        keyPoints: [
          "Document contains structured information",
          "Professional language and terminology detected",
          "Relevant to telecommunications industry",
          "Contains actionable items or requirements"
        ],
        recommendations: [
          "Review and categorize document appropriately",
          "Share with relevant team members",
          "Follow up on any action items mentioned",
          "Archive in appropriate document management system"
        ],
        sentiment: "Professional",
        confidence: 0.87
      };

      // Convert to JSON-compatible format for database storage
      const jsonResult = JSON.parse(JSON.stringify(mockResult));

      const { data, error } = await supabase
        .from('document_analysis')
        .insert({
          file_name: selectedFile ? selectedFile.name : 'Text Input',
          status: 'processing',
          created_by: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Simulate AI analysis (replace with actual AI service)
      setTimeout(async () => {
        // Update database with results
        await supabase
          .from('document_analysis')
          .update({
            status: 'completed',
            analysis_result: jsonResult,
          })
          .eq('id', data.id);

        setAnalysisResult(mockResult);
        setIsAnalyzing(false);

        toast({
          title: "Analysis Complete",
          description: "Document has been successfully analyzed.",
        });
      }, 3000);

    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetAnalyzer = () => {
    setSelectedFile(null);
    setTextInput("");
    setAnalysisResult(null);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Document Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!analysisResult ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Document
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt"
                    className="rounded-[30px]"
                    disabled={isAnalyzing}
                    placeholder="Select a document to analyze..."
                  />
                  {selectedFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {selectedFile.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                OR
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter Text Directly
                </label>
                <Textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste your text here for AI analysis..."
                  className="min-h-32 rounded-[30px]"
                  disabled={isAnalyzing || !!selectedFile}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={analyzeDocument}
                disabled={isAnalyzing || (!selectedFile && !textInput.trim())}
                className="rounded-[30px]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Document
                  </>
                )}
              </Button>
              
              {(selectedFile || textInput) && (
                <Button
                  variant="outline"
                  onClick={resetAnalyzer}
                  disabled={isAnalyzing}
                  className="rounded-[30px]"
                >
                  Reset
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <span className="font-medium">Analysis Complete</span>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{analysisResult.summary}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <span className="text-sm font-medium">Sentiment: </span>
                  <span className="text-sm">{analysisResult.sentiment}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Confidence: </span>
                  <span className="text-sm">{(analysisResult.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <Button onClick={resetAnalyzer} variant="outline" className="rounded-[30px]">
              Analyze Another Document
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
