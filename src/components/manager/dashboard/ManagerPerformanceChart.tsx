
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useManagerOperations } from "@/hooks/manager/useManagerOperations";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp } from "lucide-react";

export const ManagerPerformanceChart = () => {
  const { projects, managedDepartments } = useManagerOperations();

  // Prepare project status data
  const projectStatusData = [
    { name: 'Planning', value: projects?.filter(p => p.status === 'planning').length || 0 },
    { name: 'Active', value: projects?.filter(p => p.status === 'active').length || 0 },
    { name: 'On Hold', value: projects?.filter(p => p.status === 'on_hold').length || 0 },
    { name: 'Completed', value: projects?.filter(p => p.status === 'completed').length || 0 },
  ];

  // Prepare department data
  const departmentData = managedDepartments?.map(dept => ({
    name: dept.name.length > 10 ? dept.name.substring(0, 10) + '...' : dept.name,
    employees: dept.employee_count || 0,
    projects: projects?.filter(p => p.department_id === dept.id).length || 0,
  })) || [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Department Performance */}
      <Card className="rounded-3xl border border-red-600/20">
        <CardHeader className="bg-gradient-to-r from-red-600/10 to-red-500/10 rounded-t-3xl">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <TrendingUp className="h-5 w-5" />
            Department Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {departmentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="employees" fill="#dc2626" name="Employees" />
                <Bar dataKey="projects" fill="#fca5a5" name="Projects" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No department data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Status Distribution */}
      <Card className="rounded-3xl border border-red-600/20">
        <CardHeader className="bg-gradient-to-r from-red-600/10 to-red-500/10 rounded-t-3xl">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <TrendingUp className="h-5 w-5" />
            Project Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {projectStatusData.some(item => item.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData.filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No project data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
