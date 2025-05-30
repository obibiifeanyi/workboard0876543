
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Download, Brain, Loader, Trash2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useDropzone } from "react-dropzone";

interface AnalysisResult {
  id: string;
  fileName: string;
  fileType: string;
  analysis: {
    summary: string;
    keyPoints: string[];
    suggestedActions: string[];
    categories: string[];
    sentiment?: string;
    wordCount?: number;
  };
  createdAt: string;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  progress: number;
  status: 'uploading' | 'analyzing' | 'completed' | 'error';
  result?: AnalysisResult;
}

export const AIDocumentAnalyzer = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      progress: 0,
      status: 'uploading' as const
    }));

    setFiles(prev => [...prev, ...newFiles]);

    for (const [index, file] of acceptedFiles.entries()) {
      const fileId = newFiles[index].id;
      
      try {
        // Simulate upload progress
        const uploadInterval = setInterval(() => {
          setFiles(prev => prev.map(f => 
            f.id === fileId && f.progress < 90 
              ? { ...f, progress: f.progress + 10 }
              : f
          ));
        }, 200);

        // Read file content
        const content = await readFileContent(file);
        
        clearInterval(uploadInterval);
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: 100, status: 'analyzing' }
            : f
        ));

        // Analyze with AI
        const { data, error } = await supabase.functions.invoke('analyze-document', {
          body: { 
            content,
            fileName: file.name,
            fileType: file.type
          }
        });

        if (error) throw error;

        const result: AnalysisResult = {
          id: Math.random().toString(36).substr(2, 9),
          fileName: file.name,
          fileType: file.type,
          analysis: data.analysis,
          createdAt: new Date().toISOString()
        };

        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'completed', result }
            : f
        ));

        toast({
          title: "Analysis Complete",
          description: `${file.name} has been analyzed successfully`,
        });

      } catch (error) {
        console.error('Error analyzing file:', error);
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'error' }
            : f
        ));
        
        toast({
          title: "Analysis Failed",
          description: `Failed to analyze ${file.name}`,
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = reject;
      
      if (file.type.includes('text') || file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File Removed",
      description: "File has been removed from the analyzer",
    });
  };

  const downloadReport = async (analysis: AnalysisResult) => {
    const reportContent = generateReport(analysis);
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analysis.fileName}_analysis.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReport = (analysis: AnalysisResult): string => {
    return `
AI DOCUMENT ANALYSIS REPORT
============================

File: ${analysis.fileName}
Type: ${analysis.fileType}
Analyzed: ${new Date(analysis.createdAt).toLocaleString()}

SUMMARY
-------
${analysis.analysis.summary}

KEY POINTS
----------
${analysis.analysis.keyPoints.map(point => `• ${point}`).join('\n')}

SUGGESTED ACTIONS
-----------------
${analysis.analysis.suggestedActions.map(action => `• ${action}`).join('\n')}

CATEGORIES
----------
${analysis.analysis.categories.join(', ')}

${analysis.analysis.sentiment ? `SENTIMENT: ${analysis.analysis.sentiment}` : ''}
${analysis.analysis.wordCount ? `WORD COUNT: ${analysis.analysis.wordCount}` : ''}
    `.trim();
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Document Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports: PDF, DOCX, XLSX, CSV, TXT (Max 10MB)
            </p>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB • {file.status}
                  </p>
                  {file.status === 'uploading' || file.status === 'analyzing' ? (
                    <Progress value={file.progress} className="mt-2" />
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  {file.status === 'analyzing' && (
                    <Loader className="h-4 w-4 animate-spin text-primary" />
                  )}
                  {file.status === 'completed' && file.result && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedAnalysis(file.result!)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => downloadReport(file.result!)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteFile(file.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {selectedAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Analysis Results: {selectedAnalysis.fileName}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadReport(selectedAnalysis)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAnalysis(null)}
                >
                  Close
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Summary</h3>
              <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                {selectedAnalysis.analysis.summary}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Key Points</h3>
              <ul className="space-y-1">
                {selectedAnalysis.analysis.keyPoints.map((point, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Suggested Actions</h3>
              <ul className="space-y-1">
                {selectedAnalysis.analysis.suggestedActions.map((action, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-primary">→</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAnalysis.analysis.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {selectedAnalysis.analysis.sentiment && (
              <div>
                <h3 className="font-semibold mb-2">Sentiment Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAnalysis.analysis.sentiment}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
