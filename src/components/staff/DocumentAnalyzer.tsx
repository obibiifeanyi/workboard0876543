import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, Search, AlertCircle, Loader2, CheckCircle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { DocumentService } from "@/services/documentService";
import { DocumentAnalysis } from "@/lib/ai/documentAI";
import { DocumentAnalysisHistory } from "@/components/ai/DocumentAnalysisHistory";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const DocumentAnalyzer = () => {
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Document states
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysis | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Reset success state after 3 seconds
  useEffect(() => {
    let successTimer: NodeJS.Timeout;
    
    if (isSuccess) {
      successTimer = setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }
    
    return () => {
      if (successTimer) {
        clearTimeout(successTimer);
      }
    };
  }, [isSuccess]);

  // Progress simulation
  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    
    if (isAnalyzing && analysisProgress < 90) {
      progressTimer = setTimeout(() => {
        setAnalysisProgress(prev => Math.min(prev + 10, 90));
      }, 500);
    }
    
    return () => {
      if (progressTimer) {
        clearTimeout(progressTimer);
      }
    };
  }, [isAnalyzing, analysisProgress]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Reset states
      setValidationErrors([]);
      setError(null);
      setIsSuccess(false);
      
      const selectedFile = e.target.files[0];
      
      // Validate file
      const validation = DocumentService.validateFile(selectedFile);
      if (!validation.valid) {
        setValidationErrors([validation.error || 'Invalid file']);
        setError(validation.error || 'Invalid file');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const validateAnalysis = (): boolean => {
    const errors: string[] = [];
    
    if (!file) {
      errors.push("Please select a file to analyze");
    }
    
    if (!user) {
      errors.push("Please log in to analyze documents");
    }
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      setError(errors[0]);
      return false;
    }
    
    return true;
  };

  const analyzeDocument = async () => {
    // Validate
    if (!validateAnalysis()) {
      return;
    }
    
    // Reset states
    setValidationErrors([]);
    setIsSubmitting(true);
    setIsSuccess(false);
    setIsAnalyzing(true);
    setError(null);
    setAnalysisProgress(10);
    
    try {
      if (!file || !user) return;
      
      // Use document service to analyze
      const result = await DocumentService.analyzeDocument(file, user.id);
      
      if (!result.success) {
        throw new Error(result.error || "Analysis failed");
      }
      
      // Set results
      setAnalysisProgress(100);
      setAnalysisResult(result.data || null);
      setIsSuccess(true);
      
      toast({
        title: "Document Analyzed",
        description: `${file.name} has been successfully analyzed.`,
      });
      
    } catch (err: any) {
      console.error("Document analysis error:", err);
      const errorMessage = err.message || "Failed to analyze document";
      
      setError(errorMessage);
      setValidationErrors([errorMessage]);
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setIsSubmitting(false);
    }
  };

  return (
    <Tabs defaultValue="analyze" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="analyze">Analyze Document</TabsTrigger>
        <TabsTrigger value="history">Analysis History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="analyze" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Document Analyzer</CardTitle>
            <CardDescription>
              Upload a document to analyze with AI. Supported formats: PDF, Word, Excel, and text files.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Upload Document</label>
              <div className="flex items-center gap-2">
                <Input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="max-w-sm"
                  accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                  disabled={isAnalyzing}
                />
                <Button 
                  onClick={analyzeDocument} 
                  disabled={isSubmitting || !file}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze
                      <Search className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              
              {/* Validation errors */}
              {validationErrors.length > 0 && (
                <div className="flex items-center text-destructive text-sm mt-1">
                  <AlertCircle className="h-4 w-4 mr-1 shrink-0" />
                  <span>{validationErrors[0]}</span>
                </div>
              )}
              
              {/* Success message */}
              {isSuccess && (
                <div className="flex items-center text-green-500 text-sm mt-1">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Document successfully analyzed
                </div>
              )}
              
              {/* Selected file info */}
              {file && (
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md mt-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {DocumentService.formatFileSize(file.size)} • {DocumentService.getDocumentTypeLabel(file.type)}
                    </p>
                  </div>
                  {file.type && (
                    <Badge variant="outline" className="ml-auto">
                      {file.type.split('/')[1]?.toUpperCase() || 'DOC'}
                    </Badge>
                  )}
                </div>
              )}
              
              {/* Analysis progress */}
              {isAnalyzing && (
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Analyzing document...</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                </div>
              )}
              
              {/* Analysis result summary */}
              {analysisResult && (
                <Card className="mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Analysis Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysisResult.analysis_result?.summary && (
                        <div>
                          <h4 className="font-medium mb-1">Summary</h4>
                          <p className="text-sm text-muted-foreground">
                            {analysisResult.analysis_result.summary}
                          </p>
                        </div>
                      )}
                      
                      {analysisResult.document_type && (
                        <div className="flex items-center gap-2">
                          <Badge>{analysisResult.document_type}</Badge>
                          {analysisResult.confidence_score && (
                            <Badge variant="outline">
                              {Math.round(analysisResult.confidence_score * 100)}% confidence
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <Button variant="outline" size="sm">
                        View Full Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="history" className="mt-4">
        <DocumentAnalysisHistory />
      </TabsContent>
    </Tabs>
  );
};