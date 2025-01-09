import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCards } from "@/components/StatsCards";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Clock, CalendarIcon, CheckCircle, Bell, User, ListTodo, 
  ClipboardList, FileText, Signal, Battery, MessageSquare,
  Users, Settings, StickyNote
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatBox } from "@/components/ChatBox";
import { TaskList } from "@/components/staff/TaskList";
import { LeaveApplication } from "@/components/staff/LeaveApplication";
import { ProfileSection } from "@/components/staff/ProfileSection";
import { ProjectTracking } from "@/components/staff/ProjectTracking";
import { PerformanceMetrics } from "@/components/staff/PerformanceMetrics";
import { MemoGeneration } from "@/components/staff/MemoGeneration";
import { WeeklyReport } from "@/components/staff/reports/WeeklyReport";
import { TelecomSiteReport } from "@/components/staff/reports/TelecomSiteReport";
import { ProjectReport } from "@/components/staff/reports/ProjectReport";
import { MeetingCenter } from "@/components/staff/MeetingCenter";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());

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
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        <div className="grid gap-4 md:gap-6">
          <StatsCards stats={stats} />
          <PerformanceMetrics />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            onClick={() => navigate("/staff/memos")}
          >
            <StickyNote className="mr-2 h-5 w-5" />
            Memos
          </Button>

          <Button
            variant="outline"
            className="glass-card border-primary/20 h-24 text-lg font-semibold hover:border-primary/40 transition-all duration-300"
            onClick={() => navigate("/staff/reports")}
          >
            <FileText className="mr-2 h-5 w-5" />
            Reports
          </Button>

          <Button
            variant="outline"
            className="glass-card border-primary/20 h-24 text-lg font-semibold hover:border-primary/40 transition-all duration-300"
            onClick={() => navigate("/staff/telecom-reports")}
          >
            <Signal className="mr-2 h-5 w-5" />
            Telecom Reports
          </Button>

          <Button
            variant="outline"
            className="glass-card border-primary/20 h-24 text-lg font-semibold hover:border-primary/40 transition-all duration-300"
            onClick={() => navigate("/staff/battery-reports")}
          >
            <Battery className="mr-2 h-5 w-5" />
            Battery Reports
          </Button>

          <Button
            variant="outline"
            className="glass-card border-primary/20 h-24 text-lg font-semibold hover:border-primary/40 transition-all duration-300"
            onClick={() => navigate("/staff/meetings")}
          >
            <Users className="mr-2 h-5 w-5" />
            Meeting Center
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

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="memos">Memos</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <div className="mt-6 bg-black/5 dark:bg-black/20 rounded-3xl p-4 md:p-6">
            <TabsContent value="overview" className="space-y-4">
              <ProjectTracking />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <TaskList tasks={[]} />
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="grid gap-6">
                <WeeklyReport />
                <ProjectReport />
                <TelecomSiteReport />
              </div>
            </TabsContent>

            <TabsContent value="memos" className="space-y-4">
              <MemoGeneration />
            </TabsContent>

            <TabsContent value="meetings" className="space-y-4">
              <MeetingCenter />
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <ProfileSection />
              <LeaveApplication
                date={date}
                onDateSelect={setDate}
                onLeaveRequest={() => {
                  toast({
                    title: "Leave Request Submitted",
                    description: `Your leave request for ${date?.toLocaleDateString()} has been submitted.`,
                  });
                }}
              />
            </TabsContent>
          </div>
        </Tabs>

        <ChatBox />
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;