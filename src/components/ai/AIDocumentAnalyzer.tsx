
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSystemData } from '@/hooks/useSystemData';
import {
  Upload,
  File,
  FileText,
  Download,
  Loader,
  CheckCircle,
  AlertCircle,
  Brain,
  Database
} from 'lucide-react';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  suggestedActions: string[];
  categories: string[];
  sentiment: string;
  wordCount: number;
  systemInsights?: {
    relatedProjects?: any[];
    relevantTasks?: any[];
    connectedPersonnel?: any[];
    departmentContext?: any[];
  };
}

export const AIDocumentAnalyzer = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyses, setAnalyses] = useState<{[key: string]: AnalysisResult}>({});
  const [processingFiles, setProcessingFiles] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // System data hooks for context
  const systemData = useSystemData();
  const { data: profiles } = systemData.useProfiles();
  const { data: projects } = systemData.useProjects();
  const { data: tasks } = systemData.useTasks();
  const { data: memos } = systemData.useMemos();
  const { data: departments } = systemData.useDepartments();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/plain',
        'text/csv'
      ];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
    });

    if (validFiles.length !== acceptedFiles.length) {
      toast({
        title: "Invalid Files",
        description: "Some files were rejected. Only PDF, DOCX, XLSX, CSV, and TXT files under 10MB are allowed.",
        variant: "destructive",
      });
    }

    setFiles(prev => [...prev, ...validFiles]);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
    },
    multiple: true,
  });

  const extractFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type === 'text/plain' || file.type === 'text/csv') {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const result = await mammoth.extractRawText({ arrayBuffer });
            resolve(result.value);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      } else if (file.type.includes('sheet') || file.type.includes('excel')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            let content = '';
            workbook.SheetNames.forEach(sheetName => {
              const sheet = workbook.Sheets[sheetName];
              content += XLSX.utils.sheet_to_txt(sheet) + '\n';
            });
            resolve(content);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error('Unsupported file type'));
      }
    });
  };

  const createSystemContext = () => {
    return {
      profiles: profiles || [],
      projects: projects || [],
      tasks: tasks || [],
      memos: memos || [],
      departments: departments || [],
    };
  };

  const analyzeFile = async (file: File) => {
    const fileId = `${file.name}_${file.size}`;
    setProcessingFiles(prev => new Set(prev).add(fileId));
    
    try {
      setProgress(10);
      const content = await extractFileContent(file);
      setProgress(30);

      const systemContext = createSystemContext();
      
      setProgress(60);
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: { 
          content,
          fileName: file.name,
          fileType: file.type,
          systemContext // Include system data for AI context
        }
      });

      if (error) throw error;

      setProgress(100);
      const analysis = data.analysis as AnalysisResult;
      
      setAnalyses(prev => ({
        ...prev,
        [fileId]: analysis
      }));

      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${file.name}`,
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: `Failed to analyze ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setProcessingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
      setProgress(0);
    }
  };

  const analyzeAllFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files",
        description: "Please upload files first",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    for (const file of files) {
      await analyzeFile(file);
    }
    setUploading(false);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const downloadAnalysis = (fileName: string, analysis: AnalysisResult) => {
    const report = `
# Analysis Report: ${fileName}

## Summary
${analysis.summary}

## Key Points
${analysis.keyPoints.map(point => `• ${point}`).join('\n')}

## Suggested Actions
${analysis.suggestedActions.map(action => `• ${action}`).join('\n')}

## Categories
${analysis.categories.join(', ')}

## Sentiment
${analysis.sentiment}

## Word Count
${analysis.wordCount}

${analysis.systemInsights ? `
## System Insights
### Related Projects
${analysis.systemInsights.relatedProjects?.map(p => `• ${p.name}`).join('\n') || 'None found'}

### Relevant Tasks
${analysis.systemInsights.relevantTasks?.map(t => `• ${t.title}`).join('\n') || 'None found'}

### Connected Personnel
${analysis.systemInsights.connectedPersonnel?.map(p => `• ${p.full_name}`).join('\n') || 'None found'}
` : ''}

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_${fileName.replace(/\.[^/.]+$/, '')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Document Analyzer
            <Badge variant="secondary" className="ml-2">
              <Database className="h-3 w-3 mr-1" />
              System Context Enabled
            </Badge>
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
            {isDragActive ? (
              <p className="text-lg">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, DOCX, XLSX, CSV, TXT (max 10MB each)
                </p>
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Uploaded Files</h3>
              <div className="space-y-2">
                {files.map((file, index) => {
                  const fileId = `${file.name}_${file.size}`;
                  const isProcessing = processingFiles.has(fileId);
                  const hasAnalysis = analyses[fileId];
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isProcessing && <Loader className="h-4 w-4 animate-spin" />}
                        {hasAnalysis && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {!isProcessing && !hasAnalysis && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 space-y-2">
                {progress > 0 && <Progress value={progress} className="w-full" />}
                <Button 
                  onClick={analyzeAllFiles} 
                  disabled={uploading || processingFiles.size > 0}
                  className="w-full"
                >
                  {uploading || processingFiles.size > 0 ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze All Files
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {Object.keys(analyses).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(analyses).map(([fileId, analysis]) => {
              const fileName = fileId.split('_')[0];
              return (
                <div key={fileId} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{fileName}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadAnalysis(fileName, analysis)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Summary</h4>
                      <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Key Points</h4>
                      <ul className="text-sm space-y-1">
                        {analysis.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <h4 className="font-medium mb-2">Categories</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.categories.map((category, i) => (
                          <Badge key={i} variant="secondary">{category}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Sentiment</h4>
                      <Badge variant={
                        analysis.sentiment === 'positive' ? 'default' :
                        analysis.sentiment === 'negative' ? 'destructive' : 'secondary'
                      }>
                        {analysis.sentiment}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Word Count</h4>
                      <p className="text-lg font-semibold">{analysis.wordCount}</p>
                    </div>
                  </div>

                  {analysis.systemInsights && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          System Context Insights
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          {analysis.systemInsights.relatedProjects?.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium mb-1">Related Projects</h5>
                              <ul className="text-sm space-y-1">
                                {analysis.systemInsights.relatedProjects.map((project, i) => (
                                  <li key={i} className="text-muted-foreground">• {project.name}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {analysis.systemInsights.relevantTasks?.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium mb-1">Relevant Tasks</h5>
                              <ul className="text-sm space-y-1">
                                {analysis.systemInsights.relevantTasks.map((task, i) => (
                                  <li key={i} className="text-muted-foreground">• {task.title}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <Separator className="my-4" />

                  <div>
                    <h4 className="font-medium mb-2">Suggested Actions</h4>
                    <ul className="text-sm space-y-1">
                      {analysis.suggestedActions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
