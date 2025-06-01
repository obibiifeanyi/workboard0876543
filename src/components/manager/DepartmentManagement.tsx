
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useManagerOperations } from "@/hooks/manager/useManagerOperations";
import { Building2, Users, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const DepartmentManagement = () => {
  const { managedDepartments, teamMembers, isLoadingDepartments, isLoadingTeamMembers } = useManagerOperations();

  if (isLoadingDepartments || isLoadingTeamMembers) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="h-6 w-6 text-red-600" />
        <h1 className="text-2xl font-bold">Department Management</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {managedDepartments?.map((department) => {
          const departmentMembers = teamMembers?.filter(member => member.department_id === department.id) || [];
          
          return (
            <Card key={department.id} className="rounded-3xl border-red-600/20">
              <CardHeader className="bg-gradient-to-r from-red-600/10 to-red-500/10 rounded-t-3xl">
                <CardTitle className="text-red-700">{department.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {department.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{departmentMembers.length} members</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Team Members</h4>
                    {departmentMembers.length > 0 ? (
                      <div className="space-y-2">
                        {departmentMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">{member.full_name}</span>
                            <Badge variant="outline">{member.role}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No members assigned</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {managedDepartments?.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Departments</h3>
            <p className="text-muted-foreground">You are not managing any departments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
