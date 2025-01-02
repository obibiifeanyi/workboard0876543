import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WeeklyReport = () => {
  const { toast } = useToast();

  const handleSubmitReport = () => {
    toast({
      title: "Weekly Report Submitted",
      description: "Your weekly report has been submitted successfully",
    });
  };

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Calendar className="h-5 w-5 text-primary" />
          Weekly Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Week Number</label>
            <input
              type="week"
              className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tasks Completed</label>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-lg font-semibold">8/10</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Weekly Summary</label>
          <textarea
            className="w-full rounded-md border border-gray-300 bg-white/5 p-2 min-h-[100px]"
            placeholder="Summarize your weekly activities..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Challenges Faced</label>
          <textarea
            className="w-full rounded-md border border-gray-300 bg-white/5 p-2 min-h-[60px]"
            placeholder="Describe any challenges or blockers..."
          />
        </div>
        <Button onClick={handleSubmitReport} className="w-full md:w-auto">
          Submit Weekly Report
        </Button>
      </CardContent>
    </Card>
  );
};