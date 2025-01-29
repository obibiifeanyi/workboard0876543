import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { FileUp, File, Brain } from "lucide-react";

export const AIDocumentUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      setFiles(Array.from(fileList));
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          toast({
            title: "Upload Complete",
            description: "Documents have been processed for AI training",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary animate-pulse" />
          AI Document Training
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="ai-file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-primary/5"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileUp className="w-8 h-8 mb-2 text-primary" />
              <p className="mb-2 text-sm">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOCX, TXT (MAX. 10MB)
              </p>
            </div>
            <input
              id="ai-file-upload"
              type="file"
              className="hidden"
              multiple
              onChange={handleFileUpload}
              accept=".pdf,.docx,.txt"
            />
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-lg bg-background/50"
              >
                <File className="h-4 w-4 text-primary" />
                <span className="text-sm truncate flex-1">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            ))}
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};