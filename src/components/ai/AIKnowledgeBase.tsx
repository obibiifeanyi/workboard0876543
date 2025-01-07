import { useState } from "react";
import { Brain, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUploadSection } from "./FileUploadSection";
import { AIAnalysisStatus } from "./AIAnalysisStatus";
import { StorageStatus } from "./StorageStatus";

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

  const hasAccess = userRole === 'admin' || userRole === 'manager';

  if (!hasAccess) {
    return (
      <Alert variant="destructive" className="animate-fade-in">
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
    <div className="space-y-6 h-full overflow-y-auto animate-fade-in">
      <StorageStatus
        filesCount={files.length}
        isTraining={isTraining}
        trainingProgress={trainingProgress}
      />

      <FileUploadSection
        files={files}
        onFileUpload={handleFileUpload}
        onDelete={handleDelete}
      />

      <div className="flex justify-end">
        <Button
          onClick={handleTrain}
          disabled={files.length === 0 || isTraining}
          className="bg-secondary hover:bg-secondary/90"
        >
          <Brain className="h-4 w-4 mr-2" />
          Analyze Documents
        </Button>
      </div>

      <AIAnalysisStatus
        isTraining={isTraining}
        trainingProgress={trainingProgress}
      />
    </div>
  );
};