import { WorkBoard } from "@/components/manager/WorkBoard";
import { LeaveManagement } from "@/components/manager/LeaveManagement";
import { TeamOverview } from "@/components/manager/TeamOverview";
import { TelecomSites } from "@/components/manager/TelecomSites";
import { TeamTimeManagement } from "@/components/manager/TeamTimeManagement";
import { EmailNotificationCenter } from "@/components/notifications/EmailNotificationCenter";
import { ProjectReportForm } from "@/components/reports/ProjectReportForm";
import { MemoManagement } from "@/components/memos/MemoManagement";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MeetingCenter = () => {
  const { toast } = useToast();

  const handleCreateMeeting = () => {
    // This would typically integrate with Google Meet API
    window.open("https://meet.google.com/new", "_blank");
    toast({
      title: "Meeting Created",
      description: "New Google Meet session has been initiated",
    });
  };

  const upcomingMeetings = [
    {
      id: 1,
      title: "Team Sync",
      time: "10:00 AM",
      date: "Today",
      attendees: 5,
    },
    {
      id: 2,
      title: "Project Review",
      time: "2:00 PM",
      date: "Tomorrow",
      attendees: 8,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleCreateMeeting} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create New Meeting
          </Button>
        </CardContent>
      </Card>

      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Meetings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-center justify-between p-4 rounded-lg bg-black/5 dark:bg-white/5"
              >
                <div>
                  <h4 className="font-medium">{meeting.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {meeting.date} at {meeting.time}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4 mr-2" />
                  Join
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ManagerTabContent = () => {
  return (
    <>
      <TabsContent value="time" className="space-y-6 mt-0">
        <TeamTimeManagement />
      </TabsContent>

      <TabsContent value="workboard" className="space-y-6 mt-0">
        <WorkBoard />
      </TabsContent>

      <TabsContent value="leave" className="space-y-6 mt-0">
        <LeaveManagement />
      </TabsContent>

      <TabsContent value="team" className="space-y-6 mt-0">
        <TeamOverview />
      </TabsContent>

      <TabsContent value="sites" className="space-y-6 mt-0">
        <TelecomSites />
      </TabsContent>

      <TabsContent value="reports" className="space-y-6 mt-0">
        <ProjectReportForm />
      </TabsContent>

      <TabsContent value="memos" className="space-y-6 mt-0">
        <MemoManagement />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6 mt-0">
        <EmailNotificationCenter />
        <MeetingCenter />
      </TabsContent>
    </>
  );
};