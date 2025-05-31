
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useManagerOperations } from "@/hooks/manager/useManagerOperations";
import { Users, Building2 } from "lucide-react";

export const TeamOverview = () => {
  const { managedDepartments, teamMembers, isLoadingTeam } = useManagerOperations();

  if (isLoadingTeam) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Department Overview */}
      <Card className="rounded-3xl border border-red-600/20">
        <CardHeader className="bg-gradient-to-r from-red-600/10 to-red-500/10 rounded-t-3xl">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Building2 className="h-5 w-5" />
            Managed Departments
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {managedDepartments && managedDepartments.length > 0 ? (
            <div className="grid gap-4">
              {managedDepartments.map((dept) => (
                <div key={dept.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{dept.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{dept.description}</p>
                    </div>
                    <Badge variant="outline">
                      {dept.employee_count || 0} employees
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No departments assigned to manage yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card className="rounded-3xl border border-red-600/20">
        <CardHeader className="bg-gradient-to-r from-red-600/10 to-red-500/10 rounded-t-3xl">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {teamMembers && teamMembers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {member.full_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.full_name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {managedDepartments?.find(d => d.id === member.department_id)?.name || "Not assigned"}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={member.status === "active" ? "default" : "secondary"}
                        className={member.status === "active" ? "bg-green-100 text-green-800" : ""}
                      >
                        {member.status || "active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {member.created_at ? new Date(member.created_at).toLocaleDateString() : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No team members found in your managed departments.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
