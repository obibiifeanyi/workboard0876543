
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useManagerOperations } from "@/hooks/manager/useManagerOperations";
import { FolderPlus, Users, Calendar, DollarSign } from "lucide-react";

export const ProjectManagement = () => {
  const { 
    managedDepartments, 
    teamMembers, 
    projects, 
    isLoadingProjects,
    createProject,
    addProjectMember 
  } = useManagerOperations();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department_id: "",
    status: "planning",
    start_date: "",
    end_date: "",
    budget: "",
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createProject.mutateAsync({
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : 0,
    });
    
    setFormData({
      name: "",
      description: "",
      department_id: "",
      status: "planning",
      start_date: "",
      end_date: "",
      budget: "",
    });
    setIsCreateOpen(false);
  };

  const handleAddMember = async (projectId: string, userId: string, role: string) => {
    await addProjectMember.mutateAsync({ projectId, userId, role });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning": return "bg-blue-100 text-blue-800";
      case "active": return "bg-green-100 text-green-800";
      case "on_hold": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-purple-100 text-purple-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoadingProjects) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Management</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-red-600 to-red-700">
              <FolderPlus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="department_id">Department</Label>
                  <Select
                    value={formData.department_id}
                    onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {managedDepartments?.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createProject.isPending}>
                  Create Project
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {projects?.map((project) => (
          <Card key={project.id} className="rounded-3xl border border-red-600/20">
            <CardHeader className="bg-gradient-to-r from-red-600/10 to-red-500/10 rounded-t-3xl">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-red-700">{project.name}</CardTitle>
                  <p className="text-muted-foreground mt-1">{project.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(project.status || "planning")}>
                    {project.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {project.start_date ? new Date(project.start_date).toLocaleDateString() : "No start date"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : "No end date"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">${project.budget || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{project.project_members?.length || 0} members</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Team Members</h4>
                  <Select
                    onValueChange={(userId) => {
                      if (userId) {
                        handleAddMember(project.id, userId, "member");
                      }
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Add team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers?.filter(member => 
                        !project.project_members?.some(pm => pm.user_id === member.id)
                      ).map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {project.project_members && project.project_members.length > 0 ? (
                  <div className="grid gap-2">
                    {project.project_members.map((member) => (
                      <div key={member.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{member.profiles?.full_name}</span>
                          <span className="text-sm text-muted-foreground ml-2">({member.role})</span>
                        </div>
                        <Badge variant="outline">{member.profiles?.email}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No team members assigned yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {projects?.length === 0 && (
          <Card className="rounded-3xl text-center py-12">
            <CardContent>
              <FolderPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-4">Create your first project to get started</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                Create Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
