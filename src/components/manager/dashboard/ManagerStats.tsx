
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useManagerOperations } from "@/hooks/manager/useManagerOperations";
import { Users, FolderOpen, Building2, TrendingUp } from "lucide-react";

export const ManagerStats = () => {
  const { 
    managedDepartments, 
    teamMembers, 
    projects, 
    isLoadingDepartments,
    isLoadingTeam,
    isLoadingProjects 
  } = useManagerOperations();

  if (isLoadingDepartments || isLoadingTeam || isLoadingProjects) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
  const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
  const totalDepartments = managedDepartments?.length || 0;

  const stats = [
    {
      title: "Team Members",
      value: teamMembers?.length || 0,
      description: "Active team members",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Projects",
      value: activeProjects,
      description: "Currently running",
      icon: FolderOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Departments",
      value: totalDepartments,
      description: "Under management",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Completed Projects",
      value: completedProjects,
      description: "Successfully completed",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="rounded-3xl border border-red-600/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
