import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Target, AlertCircle } from "lucide-react";

interface Project {
  id: number;
  name: string;
  progress: number;
  deadline: string;
  status: "On Track" | "At Risk" | "Delayed";
}

const projects: Project[] = [
  {
    id: 1,
    name: "Network Infrastructure Upgrade",
    progress: 75,
    deadline: "2024-04-15",
    status: "On Track",
  },
  {
    id: 2,
    name: "5G Tower Installation",
    progress: 45,
    deadline: "2024-05-01",
    status: "At Risk",
  },
  {
    id: 3,
    name: "Fiber Optic Extension",
    progress: 90,
    deadline: "2024-03-30",
    status: "On Track",
  },
];

export const ProjectTracking = () => {
  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "On Track":
        return "text-green-500";
      case "At Risk":
        return "text-yellow-500";
      case "Delayed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Target className="h-5 w-5 text-primary" />
          Project Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="glass-card p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{project.name}</h3>
                  <span className={`flex items-center gap-1 ${getStatusColor(project.status)}`}>
                    <AlertCircle className="h-4 w-4" />
                    {project.status}
                  </span>
                </div>
                <Progress value={project.progress} className="h-2 mt-2" />
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                  <span>{project.progress}% Complete</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Due: {project.deadline}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};