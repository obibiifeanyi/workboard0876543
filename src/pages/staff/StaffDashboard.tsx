import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCards } from "@/components/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar as CalendarIcon, CheckCircle, Bell, FileText, MapPin, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TaskList } from "@/components/staff/TaskList";
import { LeaveApplication } from "@/components/staff/LeaveApplication";
import { ProfileSection } from "@/components/staff/ProfileSection";
import { DocumentAnalytics } from "@/components/documents/DocumentAnalytics";
import { EmailNotificationCenter } from "@/components/notifications/EmailNotificationCenter";
import { ChatBox } from "@/components/ChatBox";

const StaffDashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
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

  const tasks = [
    {
      id: 1,
      task: "Equipment Check",
      deadline: "2024-03-20",
      status: "In Progress",
    },
    {
      id: 2,
      task: "Data Entry",
      deadline: "2024-03-25",
      status: "Pending",
    },
    {
      id: 3,
      task: "Site Inspection",
      deadline: "2024-03-22",
      status: "Completed",
    },
  ];

  const handleLeaveRequest = () => {
    if (date) {
      toast({
        title: "Leave Request Submitted",
        description: `Your leave request for ${date.toLocaleDateString()} has been submitted.`,
      });
    }
  };

  return (
    <DashboardLayout title="Staff Dashboard">
      <div className="space-y-6 p-6">
        <StatsCards stats={stats} />

        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="sites">Telecom Sites</TabsTrigger>
            <TabsTrigger value="leave">Leave</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Current Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TaskList tasks={tasks} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <DocumentAnalytics />
          </TabsContent>

          <TabsContent value="sites" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Assigned Sites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground">
                  No sites assigned yet.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave" className="space-y-4">
            <LeaveApplication
              date={date}
              onDateSelect={setDate}
              onLeaveRequest={handleLeaveRequest}
            />
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <EmailNotificationCenter />
          </TabsContent>
        </Tabs>

        {/* Fixed AI Chat Box */}
        <ChatBox />
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;