import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCards } from "@/components/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar as CalendarIcon, CheckCircle, Bell, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TaskList } from "@/components/staff/TaskList";
import { LeaveApplication } from "@/components/staff/LeaveApplication";
import { ProfileSection } from "@/components/staff/ProfileSection";
import { EnhancedNotificationCenter } from "@/components/notifications/EnhancedNotificationCenter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const StaffDashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <nav className="space-y-4 mt-8">
              <TabsList className="flex flex-col w-full gap-2">
                <TabsTrigger value="tasks" className="w-full justify-start">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  My Tasks
                </TabsTrigger>
                <TabsTrigger value="leave" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Leave Application
                </TabsTrigger>
                <TabsTrigger value="profile" className="w-full justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  Profile
                </TabsTrigger>
              </TabsList>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
        <div className="grid gap-4 md:gap-6">
          <StatsCards stats={stats} />
        </div>

        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList className="hidden md:grid md:grid-cols-3 gap-2">
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="leave">Leave Application</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <div className="mt-6 bg-black/5 dark:bg-black/20 rounded-3xl p-4 md:p-6">
            <TabsContent value="tasks" className="space-y-4 mt-0">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl">
                    Current Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TaskList tasks={[]} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leave" className="space-y-4 mt-0">
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

            <TabsContent value="profile" className="space-y-4 mt-0">
              <ProfileSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;