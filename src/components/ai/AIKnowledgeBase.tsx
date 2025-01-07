import { useState } from "react";
import { FileUp, File, Trash2, Brain, Database, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  progress: number;
}

export const AIKnowledgeBase = ({ userRole }: { userRole?: string }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const { toast } = useToast();

  // Check if user has access (admin or manager)
  const hasAccess = userRole === 'admin' || userRole === 'manager';

  if (!hasAccess) {
    return (
      <Alert variant="destructive">
        <Lock className="h-4 w-4" />
        <AlertTitle>Access Restricted</AlertTitle>
        <AlertDescription>
          Only administrators and managers have access to the AI Knowledge Base.
        </AlertDescription>
      </Alert>
    );
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, progress: Math.min(f.progress + 10, 100) }
              : f
          )
        );
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        toast({
          title: "File Uploaded",
          description: `${file.name} has been uploaded successfully`,
        });
      }, 5000);
    });
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    toast({
      title: "File Removed",
      description: "The file has been removed from the queue",
    });
  };

  const handleTrain = () => {
    setIsTraining(true);
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          toast({
            title: "Training Complete",
            description: "AI has successfully processed all documents",
          });
          return 100;
        }
        return prev + 5;
      });
    }, 500);
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Database className="h-5 w-5" />
            <h3 className="font-semibold">Storage Status</h3>
          </div>
          <p className="text-2xl font-bold">
            {files.length} Files
          </p>
          <p className="text-sm text-muted-foreground">
            Total documents in knowledge base
          </p>
        </div>

        <div className="glass-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Brain className="h-5 w-5" />
            <h3 className="font-semibold">Learning Status</h3>
          </div>
          <p className="text-2xl font-bold">
            {isTraining ? `${trainingProgress}%` : "Ready"}
          </p>
          <p className="text-sm text-muted-foreground">
            AI training progress
          </p>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Upload Documents</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              className="bg-primary hover:bg-primary/90"
            >
              <FileUp className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
            <Button
              onClick={handleTrain}
              disabled={files.length === 0 || isTraining}
              className="bg-secondary hover:bg-secondary/90"
            >
              <Brain className="h-4 w-4 mr-2" />
              Train AI
            </Button>
          </div>
        </div>

        <input
          type="file"
          id="file-upload"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
          className="hidden"
          onChange={handleFileUpload}
        />

        <div className="space-y-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-4 p-4 glass-card"
            >
              <File className="h-8 w-8 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{file.type}</span>
                  <span>•</span>
                  <span>{file.size}</span>
                </div>
                <Progress value={file.progress} className="mt-2" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(file.id)}
                className="text-destructive hover:text-destructive/90"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {isTraining && (
        <div className="glass-card p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            <p>Training in Progress...</p>
          </div>
          <Progress value={trainingProgress} />
        </div>
      )}
    </div>
  );
};
