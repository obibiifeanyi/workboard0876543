import { Database, Brain } from "lucide-react";

interface StorageStatusProps {
  filesCount: number;
  isTraining: boolean;
  trainingProgress: number;
}

export const StorageStatus = ({ filesCount, isTraining, trainingProgress }: StorageStatusProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="glass-card p-4 space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Database className="h-5 w-5" />
          <h3 className="font-semibold">Storage Status</h3>
        </div>
        <p className="text-2xl font-bold">
          {filesCount} Files
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
  );
};