
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useManagerOperations } from "@/hooks/manager/useManagerOperations";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, AlertCircle, CheckCircle } from "lucide-react";

export const ManagerOverview = () => {
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
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const recentProjects = projects?.slice(0, 3) || [];
  const activeTeamMembers = teamMembers?.filter(member => member.status === 'active') || [];

  return (
    <div className="space-y-6">
      {/* Quick Overview */}
      <Card className="rounded-3xl border border-red-600/20">
        <CardHeader className="bg-gradient-to-r from-red-600/10 to-red-500/10 rounded-t-3xl">
          <CardTitle className="text-red-700">Manager Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Summary
              </h4>
              <p className="text-sm text-muted-foreground">
                You manage {managedDepartments?.length || 0} departments with{' '}
                {activeTeamMembers.length} active team members.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Project Status
              </h4>
              <p className="text-sm text-muted-foreground">
                {projects?.filter(p => p.status === 'active').length || 0} active projects,{' '}
                {projects?.filter(p => p.status === 'completed').length || 0} completed this quarter.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <Card className="rounded-3xl border border-red-600/20">
        <CardHeader className="bg-gradient-to-r from-red-600/10 to-red-500/10 rounded-t-3xl">
          <CardTitle className="text-red-700">Recent Projects</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {recentProjects.length > 0 ? (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={project.status === 'active' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {project.status}
                    </Badge>
                    {project.status === 'active' ? (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent projects found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Department Health */}
      <Card className="rounded-3xl border border-red-600/20">
        <CardHeader className="bg-gradient-to-r from-red-600/10 to-red-500/10 rounded-t-3xl">
          <CardTitle className="text-red-700">Department Health</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {managedDepartments && managedDepartments.length > 0 ? (
            <div className="space-y-3">
              {managedDepartments.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{dept.name}</h4>
                    <p className="text-sm text-muted-foreground">{dept.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {dept.employee_count || 0} employees
                    </Badge>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No departments assigned yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
