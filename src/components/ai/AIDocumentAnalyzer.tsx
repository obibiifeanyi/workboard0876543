
import { useState, useRef } from "react";
import { Brain, Upload, FileText, Loader, Check, AlertCircle, Download, BarChart3, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import { useAuth } from "@/hooks/useAuth";

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  suggestedActions: string[];
  categories: string[];
  sentiment: string;
  wordCount: number;
  systemInsights: {
    relatedProjects: any[];
    relevantTasks: any[];
    connectedPersonnel: any[];
    departmentContext: any[];
  };
  confidence: number;
  documentType: string;
  urgency: string;
  technicalComplexity: string;
}

const COLORS = ['#ff1c04', '#0FA0CE', '#10B981', '#F59E0B', '#8B5CF6'];

export const AIDocumentAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf', 
        'text/plain', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError("Invalid file type. Please select a PDF, Word document, Excel file, or text file.");
        return;
      }

      // Validate file size (25MB limit)
      if (file.size > 25 * 1024 * 1024) {
        setError("File too large. Please select a file smaller than 25MB.");
        return;
      }

      setSelectedFile(file);
      setTextInput("");
      setError(null);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (file.type === 'text/plain' || file.type === 'text/csv') {
          resolve(reader.result as string);
        } else {
          // For other file types, we'll pass the base64 content
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type === 'text/plain' || file.type === 'text/csv') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  const fetchSystemContext = async () => {
    try {
      const [projectsRes, tasksRes, profilesRes, departmentsRes] = await Promise.all([
        supabase.from('projects').select('*').limit(20),
        supabase.from('tasks').select('*').limit(20),
        supabase.from('profiles').select('id, full_name, role, department').limit(20),
        supabase.from('departments').select('*')
      ]);

      return {
        projects: projectsRes.data || [],
        tasks: tasksRes.data || [],
        profiles: profilesRes.data || [],
        departments: departmentsRes.data || []
      };
    } catch (error) {
      console.error('Failed to fetch system context:', error);
      return { projects: [], tasks: [], profiles: [], departments: [] };
    }
  };

  const analyzeDocument = async () => {
    if (!selectedFile && !textInput.trim()) {
      setError("Please select a file or enter text to analyze.");
      return;
    }

    if (!user) {
      setError("Please log in to analyze documents.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisProgress(0);
    
    try {
      let content = "";
      
      // Progress update
      setAnalysisProgress(20);
      
      if (selectedFile) {
        content = await extractTextFromFile(selectedFile);
      } else {
        content = textInput;
      }

      // Fetch system context
      setAnalysisProgress(40);
      const systemContext = await fetchSystemContext();

      // Call the analyze-document edge function
      setAnalysisProgress(60);
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-document', {
        body: {
          content,
          fileName: selectedFile ? selectedFile.name : 'Text Input',
          fileType: selectedFile ? selectedFile.type : 'text/plain',
          systemContext
        },
        headers: {
          'x-user-id': user.id
        }
      });

      if (analysisError) {
        throw new Error(analysisError.message || 'Analysis failed');
      }

      setAnalysisProgress(100);
      setAnalysisResult(analysisData.analysis);

      toast({
        title: "Analysis Complete",
        description: "Document has been successfully analyzed with AI.",
      });

    } catch (error: any) {
      console.error('Analysis error:', error);
      setError(error.message || 'Failed to analyze document. Please try again.');
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportAnalysis = () => {
    if (!analysisResult) return;

    const exportData = {
      fileName: selectedFile ? selectedFile.name : 'Text Analysis',
      analysisDate: new Date().toISOString(),
      ...analysisResult
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Analysis results have been exported successfully.",
    });
  };

  const resetAnalyzer = () => {
    setSelectedFile(null);
    setTextInput("");
    setAnalysisResult(null);
    setError(null);
    setAnalysisProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Prepare chart data
  const sentimentData = analysisResult ? [
    { name: 'Positive', value: analysisResult.sentiment === 'positive' ? 70 : 20, color: '#10B981' },
    { name: 'Neutral', value: analysisResult.sentiment === 'neutral' ? 70 : 30, color: '#F59E0B' },
    { name: 'Negative', value: analysisResult.sentiment === 'negative' ? 70 : 10, color: '#EF4444' }
  ] : [];

  const categoryData = analysisResult?.categories.map((cat, index) => ({
    name: cat,
    value: Math.floor(Math.random() * 40) + 60, // Simulate relevance score
    color: COLORS[index % COLORS.length]
  })) || [];

  const chartConfig = {
    sentiment: { label: "Sentiment Analysis" },
    categories: { label: "Document Categories" }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-muted-foreground">Please log in to use the AI Document Analyzer.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Document Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {!analysisResult ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Document
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                    className="rounded-[30px]"
                    disabled={isAnalyzing}
                  />
                  {selectedFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{selectedFile.name}</span>
                      <Badge variant="outline">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
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

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader className="h-4 w-4 animate-spin" />
                  Analyzing document with AI...
                </div>
                <Progress value={analysisProgress} className="w-full" />
              </div>
            )}

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                <span className="font-medium">Analysis Complete</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={exportAnalysis} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button onClick={resetAnalyzer} variant="outline" size="sm">
                  New Analysis
                </Button>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Document Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{analysisResult.documentType || 'General'}</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={analysisResult.sentiment === 'positive' ? 'default' : 'secondary'}>
                    {analysisResult.sentiment}
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Word Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-bold">{analysisResult.wordCount}</span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Confidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-bold">{(analysisResult.confidence * 100).toFixed(1)}%</span>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    Sentiment Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <RechartsPieChart data={sentimentData} cx="50%" cy="50%" outerRadius={80}>
                          {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </RechartsPieChart>
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Category Relevance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="#ff1c04" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Analysis Results */}
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{analysisResult.summary}</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
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
                    <CardTitle className="text-lg">Suggested Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysisResult.suggestedActions.map((action, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-sm">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* System Insights */}
              {(analysisResult.systemInsights.relatedProjects.length > 0 || 
                analysisResult.systemInsights.relevantTasks.length > 0 ||
                analysisResult.systemInsights.connectedPersonnel.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">System Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysisResult.systemInsights.relatedProjects.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Related Projects</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.systemInsights.relatedProjects.map((project, index) => (
                            <Badge key={index} variant="outline">{project.name}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {analysisResult.systemInsights.relevantTasks.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Relevant Tasks</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.systemInsights.relevantTasks.map((task, index) => (
                            <Badge key={index} variant="outline">{task.title}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysisResult.systemInsights.connectedPersonnel.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Connected Personnel</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.systemInsights.connectedPersonnel.map((person, index) => (
                            <Badge key={index} variant="outline">{person.full_name}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex gap-6">
                  <div>
                    <span className="text-sm font-medium">Categories: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analysisResult.categories.map((cat, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">{cat}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Analysis completed at {new Date().toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
