import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, CheckSquare, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockProjects = [
  {
    id: 1,
    name: "Network Expansion",
    deadline: "2024-05-01",
    progress: 75,
    tasks: 12,
    status: "In Progress",
  },
  {
    id: 2,
    name: "System Upgrade",
    deadline: "2024-06-15",
    progress: 30,
    tasks: 8,
    status: "Planning",
  },
];

export const ProjectManagement = () => {
  const { toast } = useToast();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          Project Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Active Projects</p>
                  <List className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">6</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Upcoming Deadlines</p>
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">3</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Completed Tasks</p>
                  <CheckSquare className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">45</p>
              </CardContent>
            </Card>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.deadline}</TableCell>
                  <TableCell>
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{project.tasks}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        project.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Project Management",
                          description: `Managing ${project.name}`,
                        });
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};