import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Calendar, Bell } from "lucide-react";

const StaffDashboard = () => {
  const stats = [
    {
      title: "Tasks Completed",
      value: "15",
      icon: CheckCircle,
    },
    {
      title: "Hours Today",
      value: "6.5",
      icon: Clock,
    },
    {
      title: "Leave Balance",
      value: "12",
      icon: Calendar,
    },
    {
      title: "Notifications",
      value: "4",
      icon: Bell,
    },
  ];

  return (
    <DashboardLayout title="Staff Dashboard">
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

export default StaffDashboard;