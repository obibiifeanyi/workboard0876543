import { useState } from "react";
import { Brain, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUploadSection } from "./FileUploadSection";
import { AIAnalysisStatus } from "./AIAnalysisStatus";
import { StorageStatus } from "./StorageStatus";
import { useAIOperations } from "@/hooks/useAIOperations";

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
  const { useKnowledgeBase, useCreateKnowledgeEntry } = useAIOperations();
  const { data: knowledgeBase, isLoading: isLoadingKB } = useKnowledgeBase();
  const createEntry = useCreateKnowledgeEntry();

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    for (const file of newFiles) {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, progress: Math.min(f.progress + 10, 100) }
              : f
          )
        );
      }, 500);

      try {
        await createEntry.mutateAsync({
          title: file.name,
          content: `Content from ${file.name}`,
          category: 'uploaded',
          tags: ['document'],
          created_by: null,
        });

        clearInterval(interval);
        toast({
          title: "File Processed",
          description: `${file.name} has been processed and added to the knowledge base`,
        });
      } catch (error) {
        clearInterval(interval);
        console.error('Error processing file:', error);
        toast({
          title: "Error",
          description: `Failed to process ${file.name}`,
          variant: "destructive",
        });
      }
    }
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
    <div className="space-y-6 h-full overflow-y-auto animate-fade-in bg-background/50 dark:bg-background/50 backdrop-blur-sm rounded-lg p-6">
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
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
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