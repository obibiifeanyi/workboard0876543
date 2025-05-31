
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useManagerOperations } from "@/hooks/manager/useManagerOperations";
import { Building2, Users } from "lucide-react";

export const DepartmentManagement = () => {
  const { managedDepartments, teamMembers, isLoadingDepartments } = useManagerOperations();

  if (isLoadingDepartments) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border border-red-600/20">
        <CardHeader className="bg-gradient-to-r from-red-600/10 to-red-500/10 rounded-t-3xl">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Building2 className="h-5 w-5" />
            Department Management
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {managedDepartments && managedDepartments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managedDepartments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell>
                      <div className="font-medium">{dept.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {dept.description || "No description"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {dept.employee_count || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {dept.manager?.full_name || "Not assigned"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(dept.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No departments found under your management.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Department Team Members */}
      <Card className="rounded-3xl border border-red-600/20">
        <CardHeader className="bg-gradient-to-r from-red-600/10 to-red-500/10 rounded-t-3xl">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Users className="h-5 w-5" />
            Department Team Members
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {teamMembers && teamMembers.length > 0 ? (
            <div className="grid gap-4">
              {managedDepartments?.map((dept) => {
                const deptMembers = teamMembers.filter(member => member.department_id === dept.id);
                return (
                  <div key={dept.id} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">{dept.name}</h4>
                    {deptMembers.length > 0 ? (
                      <div className="grid gap-2">
                        {deptMembers.map((member) => (
                          <div key={member.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{member.full_name}</span>
                              <span className="text-sm text-muted-foreground ml-2">({member.role})</span>
                            </div>
                            <Badge variant={member.status === "active" ? "default" : "secondary"}>
                              {member.status || "active"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No team members in this department</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No team members found in your departments.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
