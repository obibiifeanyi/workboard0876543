import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCards } from "@/components/StatsCards";
import { Button } from "@/components/ui/button";
import { Clock, CalendarIcon, CheckCircle, Bell, User, ListTodo, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EnhancedNotificationCenter } from "@/components/notifications/EnhancedNotificationCenter";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const stats = [
    {
      title: "Hours Today",
      value: "6.5",
      description: "Out of 8 hours",
      icon: Clock,
    },
    {
      title: "Tasks Completed",
      value: "15",
      description: "This week",
      icon: CheckCircle,
    },
    {
      title: "Leave Balance",
      value: "12",
      description: "Days remaining",
      icon: CalendarIcon,
    },
    {
      title: "Notifications",
      value: "4",
      description: "Unread messages",
      icon: Bell,
    },
  ];

  return (
    <DashboardLayout title="Staff Dashboard">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <EnhancedNotificationCenter />
      </div>
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        <div className="grid gap-4 md:gap-6">
          <StatsCards stats={stats} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="glass-card border-primary/20 h-24 text-lg font-semibold hover:border-primary/40 transition-all duration-300"
            onClick={() => navigate("/staff/current-tasks")}
          >
            <ClipboardList className="mr-2 h-5 w-5" />
            Current Tasks
          </Button>

          <Button
            variant="outline"
            className="glass-card border-primary/20 h-24 text-lg font-semibold hover:border-primary/40 transition-all duration-300"
            onClick={() => navigate("/staff/my-tasks")}
          >
            <ListTodo className="mr-2 h-5 w-5" />
            My Tasks
          </Button>

          <Button
            variant="outline"
            className="glass-card border-primary/20 h-24 text-lg font-semibold hover:border-primary/40 transition-all duration-300"
            onClick={() => navigate("/staff/profile")}
          >
            <User className="mr-2 h-5 w-5" />
            Profile
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;