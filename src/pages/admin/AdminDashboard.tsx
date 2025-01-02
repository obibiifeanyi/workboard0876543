import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Clock, Building } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Staff",
      value: "25",
      icon: Users,
    },
    {
      title: "Active Projects",
      value: "12",
      icon: Briefcase,
    },
    {
      title: "Pending Leave Requests",
      value: "5",
      icon: Clock,
    },
    {
      title: "Telecom Sites",
      value: "8",
      icon: Building,
    },
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;