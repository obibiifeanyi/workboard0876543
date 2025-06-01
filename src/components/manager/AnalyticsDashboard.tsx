
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useManagerOperations } from "@/hooks/manager/useManagerOperations";
import { BarChart3, TrendingUp, Users, FolderOpen, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const AnalyticsDashboard = () => {
  const { managedDepartments, teamMembers, projects, tasks } = useManagerOperations();

  const completedTasks = tasks?.filter(task => task.status === 'completed') || [];
  const pendingTasks = tasks?.filter(task => task.status === 'pending') || [];
  const inProgressTasks = tasks?.filter(task => task.status === 'in_progress') || [];

  const activeProjects = projects?.filter(project => project.status === 'active') || [];
  const completedProjects = projects?.filter(project => project.status === 'completed') || [];

  const stats = [
    {
      title: "Total Projects",
      value: projects?.length || 0,
      icon: FolderOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
    },
    {
      title: "Active Projects",
      value: activeProjects.length,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    {
      title: "Total Tasks",
      value: tasks?.length || 0,
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-600/10",
    },
    {
      title: "Team Members",
      value: teamMembers?.length || 0,
      icon: Users,
      color: "text-red-600",
      bgColor: "bg-red-600/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-red-600" />
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="rounded-3xl border-red-600/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Task Status Overview */}
      <Card className="rounded-3xl border-red-600/20">
        <CardHeader>
          <CardTitle className="text-red-700">Task Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-medium">Completed</h3>
              </div>
              <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <h3 className="font-medium">In Progress</h3>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{inProgressTasks.length}</div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium">Pending</h3>
              </div>
              <div className="text-2xl font-bold text-blue-600">{pendingTasks.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Status Overview */}
      <Card className="rounded-3xl border-red-600/20">
        <CardHeader>
          <CardTitle className="text-red-700">Project Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects?.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {project.project_members?.length || 0} members
                  </span>
                </div>
              </div>
            ))}
            {projects?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No projects found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Department Overview */}
      <Card className="rounded-3xl border-red-600/20">
        <CardHeader>
          <CardTitle className="text-red-700">Department Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {managedDepartments?.map((department) => {
              const departmentMembers = teamMembers?.filter(member => member.department_id === department.id) || [];
              
              return (
                <div key={department.id} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">{department.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {department.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{departmentMembers.length} members</span>
                  </div>
                </div>
              );
            })}
            {managedDepartments?.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No departments assigned</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
