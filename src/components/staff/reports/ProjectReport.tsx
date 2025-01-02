import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ProjectReport = () => {
  const { toast } = useToast();

  const handleSubmitReport = () => {
    toast({
      title: "Report Submitted",
      description: "Your project report has been submitted successfully",
    });
  };

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <FileText className="h-5 w-5 text-primary" />
          Project Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Title</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
              placeholder="Enter project title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Completion Status</label>
            <select className="w-full rounded-md border border-gray-300 bg-white/5 p-2">
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Details</label>
          <textarea
            className="w-full rounded-md border border-gray-300 bg-white/5 p-2 min-h-[100px]"
            placeholder="Enter detailed report..."
          />
        </div>
        <Button onClick={handleSubmitReport} className="w-full md:w-auto">
          <Send className="h-4 w-4 mr-2" />
          Submit Report
        </Button>
      </CardContent>
    </Card>
  );
};