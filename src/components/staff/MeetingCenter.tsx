
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Video, Calendar, Plus, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStaffOperations } from "@/hooks/useStaffOperations";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const MeetingCenter = () => {
  const { useMeetings, createMeeting } = useStaffOperations();
  const { data: meetings = [], isLoading } = useMeetings();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    meeting_type: 'general' as const,
    location: '',
    meeting_url: '',
    start_time: '',
    end_time: '',
    agenda: '',
  });

  const handleJoinMeeting = (meeting: any) => {
    if (meeting.meeting_url) {
      window.open(meeting.meeting_url, "_blank");
      toast({
        title: "Joining Meeting",
        description: `Joining ${meeting.title}...`,
      });
    } else {
      toast({
        title: "No Meeting Link",
        description: "This meeting doesn't have a video conference link.",
        variant: "destructive",
      });
    }
  };

  const handleCreateMeeting = () => {
    if (!newMeeting.title || !newMeeting.start_time || !newMeeting.end_time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createMeeting.mutate(newMeeting, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewMeeting({
          title: '',
          description: '',
          meeting_type: 'general',
          location: '',
          meeting_url: '',
          start_time: '',
          end_time: '',
          agenda: '',
        });
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingMeetings = meetings.filter(meeting => 
    new Date(meeting.start_time) > new Date() && meeting.status === 'scheduled'
  );

  if (isLoading) {
    return <div>Loading meetings...</div>;
  }

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
              Your scheduled meetings ({upcomingMeetings.length} upcoming)
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule New Meeting</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                    placeholder="Meeting title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newMeeting.description}
                    onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                    placeholder="Meeting description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newMeeting.meeting_type}
                    onValueChange={(value: any) => setNewMeeting({ ...newMeeting, meeting_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="department">Department</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start">Start Time *</Label>
                    <Input
                      id="start"
                      type="datetime-local"
                      value={newMeeting.start_time}
                      onChange={(e) => setNewMeeting({ ...newMeeting, start_time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end">End Time *</Label>
                    <Input
                      id="end"
                      type="datetime-local"
                      value={newMeeting.end_time}
                      onChange={(e) => setNewMeeting({ ...newMeeting, end_time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newMeeting.location}
                    onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                    placeholder="Meeting location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Meeting URL</Label>
                  <Input
                    id="url"
                    value={newMeeting.meeting_url}
                    onChange={(e) => setNewMeeting({ ...newMeeting, meeting_url: e.target.value })}
                    placeholder="Video conference link"
                  />
                </div>
                <Button onClick={handleCreateMeeting} className="w-full">
                  Create Meeting
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {upcomingMeetings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming meetings scheduled.
            </div>
          ) : (
            upcomingMeetings.map((meeting) => (
              <Card key={meeting.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{meeting.title}</h4>
                        <Badge className={getStatusColor(meeting.status)}>
                          {meeting.status}
                        </Badge>
                      </div>
                      {meeting.description && (
                        <p className="text-sm text-muted-foreground">{meeting.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(new Date(meeting.start_time), 'MMM dd, yyyy HH:mm')} - 
                            {format(new Date(meeting.end_time), 'HH:mm')}
                          </span>
                        </div>
                        {meeting.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{meeting.location}</span>
                          </div>
                        )}
                      </div>
                      {meeting.organizer && (
                        <p className="text-sm text-muted-foreground">
                          Organized by: {meeting.organizer.full_name}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {meeting.meeting_url && (
                        <Button
                          onClick={() => handleJoinMeeting(meeting)}
                          className="w-full md:w-auto"
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Join Meeting
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
