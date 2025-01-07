import { Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AIAnalysisStatusProps {
  isTraining: boolean;
  trainingProgress: number;
}

export const AIAnalysisStatus = ({ isTraining, trainingProgress }: AIAnalysisStatusProps) => {
  if (!isTraining) return null;

  return (
    <div className="glass-card p-4 space-y-2 animate-fade-in">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary animate-pulse" />
        <p>Analysis in Progress...</p>
      </div>
      <Progress value={trainingProgress} />
    </div>
  );
};