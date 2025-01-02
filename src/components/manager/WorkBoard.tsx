import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, BarChart2, Users } from "lucide-react";
import { StatsCards } from "@/components/StatsCards";

const mockProjects = [
  {
    id: 1,
    name: "Network Expansion",
    progress: 75,
    tasks: 12,
    deadline: "2024-04-01",
  },
  {
    id: 2,
    name: "System Upgrade",
    progress: 30,
    tasks: 8,
    deadline: "2024-04-15",
  },
];

export const WorkBoard = () => {
  const { toast } = useToast();

  const stats = [
    {
      title: "Active Projects",
      value: "8",
      description: "2 due this week",
      icon: FileText,
    },
    {
      title: "Completed Tasks",
      value: "45",
      description: "This month",
      icon: BarChart2,
    },
  ];

  const handleCreateProject = () => {
    toast({
      title: "Create Project",
      description: "Project creation modal will be implemented",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Work Board</h2>
          <p className="text-muted-foreground">Manage your team's projects and tasks</p>
        </div>
        <Button onClick={handleCreateProject} className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2">
        {mockProjects.map((project) => (
          <Card key={project.id} className="card-enhanced">
            <CardHeader>
              <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-black/20 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tasks: {project.tasks}</span>
                  <span>Due: {project.deadline}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};