import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Video, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: string[];
  link: string;
}

export const MeetingCenter = () => {
  const [meetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Weekly Team Sync",
      date: "2024-03-20",
      time: "10:00",
      participants: ["John Doe", "Jane Smith", "Mike Johnson"],
      link: "https://meet.google.com/abc-defg-hij"
    }
  ]);

  const { toast } = useToast();

  const handleJoinMeeting = (meeting: Meeting) => {
    window.open(meeting.link, "_blank");
    toast({
      title: "Joining Meeting",
      description: `Joining ${meeting.title}...`,
    });
  };

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Users className="h-5 w-5 text-primary" />
          Meeting Center
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Upcoming Meetings</h3>
            <p className="text-sm text-muted-foreground">
              Your scheduled meetings for today
            </p>
          </div>
          <Button className="w-full md:w-auto">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        </div>

        <div className="grid gap-4">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="glass-card">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{meeting.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{meeting.date} at {meeting.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {meeting.participants.join(", ")}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleJoinMeeting(meeting)}
                    className="w-full md:w-auto"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Join Meeting
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};