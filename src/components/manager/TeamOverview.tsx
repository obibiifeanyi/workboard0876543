
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, UserCheck, Clock } from "lucide-react";

interface TeamOverviewProps {
  teamMembers?: any[];
  departments?: any[];
}

export const TeamOverview = ({ teamMembers = [], departments = [] }: TeamOverviewProps) => {
  const activeMembers = teamMembers.filter(member => member.status === 'active');
  const totalDepartments = departments.length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-3xl border-red-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              Active members
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-red-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managed Departments</CardTitle>
            <Building2 className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDepartments}</div>
            <p className="text-xs text-muted-foreground">
              Under management
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-red-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <UserCheck className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-red-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">
              Team response time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      <Card className="rounded-3xl border-red-600/20">
        <CardHeader>
          <CardTitle className="text-red-700">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-medium">{member.full_name || 'Unknown User'}</h3>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                    {member.status || 'active'}
                  </Badge>
                  <Badge variant="outline">
                    {member.role || 'staff'}
                  </Badge>
                </div>
              </div>
            ))}
            {teamMembers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No team members found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Departments */}
      <Card className="rounded-3xl border-red-600/20">
        <CardHeader>
          <CardTitle className="text-red-700">Managed Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((department) => (
              <div key={department.id} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">{department.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {department.description || 'No description'}
                </p>
                <div className="mt-2">
                  <Badge variant="outline">
                    {department.employee_count || 0} members
                  </Badge>
                </div>
              </div>
            ))}
            {departments.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No departments assigned</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
