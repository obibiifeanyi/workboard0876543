
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DocumentService } from "@/services/documentService";
import { ApiService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface UploadFile extends File {
  id: string;
  progress: number;
  uploaded: boolean;
  error?: string;
}

export const DocumentUpload = ({ onUploadComplete }: { onUploadComplete?: () => void }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    category: 'general',
    tags: ''
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      ...file,
      id: Math.random().toString(36).substring(2),
      progress: 0,
      uploaded: false
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const uploadFiles = async () => {
    if (!user || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        if (file.uploaded) continue;

        // Update progress
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress: 10 } : f
        ));

        // Upload file
        const uploadResult = await DocumentService.uploadFile(file, 'documents');
        
        if (!uploadResult.success) {
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, error: uploadResult.error, progress: 0 } : f
          ));
          continue;
        }

        // Update progress
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress: 50 } : f
        ));

        // Create document record
        const documentData = {
          title: metadata.title || file.name,
          description: metadata.description,
          file_name: file.name,
          file_path: uploadResult.url!.split('/').pop(),
          file_type: file.type,
          file_size: file.size,
          category: metadata.category,
          tags: metadata.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          uploaded_by: user.id
        };

        const result = await ApiService.uploadDocument(file, documentData);

        if (result.success) {
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, progress: 100, uploaded: true } : f
          ));
        } else {
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, error: result.error, progress: 0 } : f
          ));
        }
      }

      toast.success('Documents uploaded successfully');
      onUploadComplete?.();
      
      // Reset form
      setFiles([]);
      setMetadata({
        title: '',
        description: '',
        category: 'general',
        tags: ''
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload documents');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metadata Form */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={metadata.title}
                onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter document title..."
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={metadata.category}
                onChange={(e) => setMetadata(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="general">General</option>
                <option value="reports">Reports</option>
                <option value="contracts">Contracts</option>
                <option value="procedures">Procedures</option>
                <option value="training">Training</option>
              </select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={metadata.description}
              onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter document description..."
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={metadata.tags}
              onChange={(e) => setMetadata(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g., telecom, maintenance, report"
            />
          </div>
        </CardContent>
      </Card>

      {/* File Drop Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, DOC, DOCX, XLS, XLSX, images, and text files (max 10MB each)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Files to Upload ({files.length})</h3>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex-shrink-0">
                    <File className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{file.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {DocumentService.formatFileSize(file.size)}
                      </span>
                    </div>
                    
                    {file.progress > 0 && (
                      <Progress value={file.progress} className="mt-2" />
                    )}
                    
                    {file.error && (
                      <p className="text-sm text-destructive mt-1">{file.error}</p>
                    )}
                    
                    {file.uploaded && (
                      <p className="text-sm text-green-600 mt-1">✓ Uploaded successfully</p>
                    )}
                  </div>
                  
                  {!file.uploaded && !uploading && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-4">
              <Button
                onClick={uploadFiles}
                disabled={uploading || files.every(f => f.uploaded)}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload Files'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
