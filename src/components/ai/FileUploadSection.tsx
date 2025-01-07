import { FileUp, File, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  progress: number;
}

interface FileUploadSectionProps {
  files: UploadedFile[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (id: string) => void;
}

export const FileUploadSection = ({ files, onFileUpload, onDelete }: FileUploadSectionProps) => {
  const { toast } = useToast();

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Upload Documents</h3>
        <Button
          onClick={() => document.getElementById("file-upload")?.click()}
          className="bg-primary hover:bg-primary/90"
        >
          <FileUp className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
      </div>

      <input
        type="file"
        id="file-upload"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
        className="hidden"
        onChange={onFileUpload}
      />

      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-4 p-4 glass-card animate-fade-in"
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
              onClick={() => onDelete(file.id)}
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};