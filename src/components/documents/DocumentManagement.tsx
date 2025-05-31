
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, FileText, Download, Eye, Brain, Calendar, User } from "lucide-react";
import { DocumentAnalytics } from "./DocumentAnalytics";
import { DocumentUploadForm } from "./DocumentUploadForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIDocumentAnalyzer } from "@/components/ai/AIDocumentAnalyzer";

interface AnalysisResult {
  confidence?: number;
  [key: string]: any;
}

export const DocumentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const queryClient = useQueryClient();

  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          profiles!documents_uploaded_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: analyses } = useQuery({
    queryKey: ['document-analyses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_analysis')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = Array.from(new Set(documents?.map(doc => doc.category).filter(Boolean))) || [];

  const getAnalysisForDocument = (fileName: string) => {
    return analyses?.find(analysis => analysis.file_name === fileName);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['documents'] });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ai-analyzer">AI Analyzer</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("all")}
                    size="sm"
                  >
                    All
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      size="sm"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <div className="grid gap-4">
            {documentsLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-20 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredDocuments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search terms" : "Upload your first document to get started"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredDocuments.map((document) => {
                const analysis = getAnalysisForDocument(document.file_name);
                const profileData = document.profiles as any;
                return (
                  <Card key={document.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-primary mt-1" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{document.title}</h3>
                              <p className="text-sm text-muted-foreground">{document.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {profileData?.full_name || 'Unknown'}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(document.created_at).toLocaleDateString()}
                                </div>
                                <span>{formatFileSize(document.file_size || 0)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">{document.category}</Badge>
                            <Badge variant={document.status === 'active' ? 'default' : 'secondary'}>
                              {document.status}
                            </Badge>
                            <Badge variant="outline">{document.file_type}</Badge>
                            {document.tags?.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* AI Analysis Status */}
                          {analysis && (
                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                              <Brain className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">AI Analysis:</span>
                              <Badge className={getStatusColor(analysis.status)}>
                                {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
                              </Badge>
                              {analysis.status === 'completed' && analysis.analysis_result && 
                               typeof analysis.analysis_result === 'object' && 
                               (analysis.analysis_result as AnalysisResult).confidence && (
                                <span className="text-xs text-muted-foreground">
                                  {((analysis.analysis_result as AnalysisResult).confidence! * 100).toFixed(1)}% confidence
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          {!analysis && (
                            <Button size="sm" variant="outline">
                              <Brain className="h-4 w-4 mr-1" />
                              Analyze
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <DocumentAnalytics />
        </TabsContent>

        <TabsContent value="ai-analyzer">
          <AIDocumentAnalyzer />
        </TabsContent>

        <TabsContent value="upload">
          <DocumentUploadForm onSuccess={handleUploadSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
