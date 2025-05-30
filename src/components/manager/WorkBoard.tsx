
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, BarChart2, Calendar } from "lucide-react";
import { StatsCards } from "@/components/StatsCards";
import { useManagerData } from "@/hooks/manager/useManagerData";
import { Badge } from "@/components/ui/badge";

export const WorkBoard = () => {
  const { projects, isLoadingProjects, createProject } = useManagerData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject.mutateAsync(formData);
      setIsDialogOpen(false);
      setFormData({ name: "", description: "", start_date: "", end_date: "" });
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const stats = [
    {
      title: "Active Projects",
      value: projects?.filter(p => p.status === 'in_progress').length.toString() || "0",
      description: "Currently running",
      icon: FileText,
    },
    {
      title: "Completed Projects",
      value: projects?.filter(p => p.status === 'completed').length.toString() || "0",
      description: "This quarter",
      icon: BarChart2,
    },
  ];

  if (isLoadingProjects) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Work Board</h2>
          <p className="text-muted-foreground">Manage your team's projects and tasks</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={createProject.isPending}>
                {createProject.isPending ? "Creating..." : "Create Project"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id} className="card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
                <Badge className={getStatusColor(project.status)}>
                  {project.status.replace('_', ' ')}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No start date'}
                    </span>
                    {project.end_date && (
                      <span>Due: {new Date(project.end_date).toLocaleDateString()}</span>
                    )}
                  </div>
                  {project.project_assignments && project.project_assignments.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Assigned to:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.project_assignments.map((assignment) => (
                          <Badge key={assignment.id} variant="outline">
                            {assignment.profiles?.full_name || 'Unknown'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No projects found. Create your first project to get started.
          </div>
        )}
      </div>
    </div>
  );
};
