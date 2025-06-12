import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Download, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const DocumentLibrary = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: documents, isLoading } = useQuery({
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

  const filteredDocuments = documents?.filter(doc =>
    categoryFilter === "all" || doc.category === categoryFilter
  ) || [];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Document Library</h2>
      <div className="flex gap-2 mb-4">
        <Button variant={categoryFilter === "all" ? "default" : "outline"} onClick={() => setCategoryFilter("all")}>All</Button>
        {Array.from(new Set(documents?.map(doc => doc.category).filter(Boolean))).map(category => (
          <Button key={category} variant={categoryFilter === category ? "default" : "outline"} onClick={() => setCategoryFilter(category)}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Documents</CardTitle>
          <Button><Plus className="mr-2 h-4 w-4" /> Upload Document</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>File Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.title}</TableCell>
                  <TableCell>{doc.description}</TableCell>
                  <TableCell>{doc.file_type}</TableCell>
                  <TableCell>{formatFileSize(doc.file_size || 0)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{doc.category}</Badge>
                  </TableCell>
                  <TableCell>{doc.profiles?.full_name || 'Unknown'}</TableCell>
                  <TableCell>{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : ''}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" className="mr-2"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="mr-2"><Download className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="mr-2"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}; 