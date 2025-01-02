import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, Clock, AlertCircle } from "lucide-react";

const ManagerDashboard = () => {
  const stats = [
    {
      title: "Team Members",
      value: "8",
      icon: Users,
    },
    {
      title: "Completed Tasks",
      value: "45",
      icon: CheckCircle,
    },
    {
      title: "Pending Tasks",
      value: "12",
      icon: Clock,
    },
    {
      title: "Urgent Items",
      value: "3",
      icon: AlertCircle,
    },
  ];

  return (
    <DashboardLayout title="Manager Dashboard">
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

export default ManagerDashboard;