import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockProjects = [
  { id: "PRJ-001", name: "Network Expansion" },
  { id: "PRJ-002", name: "System Upgrade" },
];

export const ProjectReportForm = () => {
  const [selectedProject, setSelectedProject] = useState("");
  const { toast } = useToast();

  const handleSubmitReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    toast({
      title: "Project Report Submitted",
      description: `Report for project ${selectedProject} has been submitted successfully`,
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
      <CardContent>
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Project</label>
            <Select
              value={selectedProject}
              onValueChange={setSelectedProject}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {mockProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.id} - {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Project Status</label>
            <Select name="status" defaultValue="in-progress">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Progress Report</label>
            <textarea
              name="report"
              className="w-full rounded-md border border-white/10 bg-white/5 p-2 min-h-[100px]"
              placeholder="Enter project progress details..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Supporting Documents</label>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center">
              <Upload className="h-8 w-8 mx-auto text-primary" />
              <p className="text-sm text-muted-foreground mt-2">
                Drop files here or click to upload
              </p>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                multiple
              />
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto">
            Submit Project Report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};