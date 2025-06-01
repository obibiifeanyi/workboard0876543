
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Calendar, Clock, MapPin, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStaffOperations } from "@/hooks/useStaffOperations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

export const Meetings = () => {
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
    agenda: ''
  });

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
          agenda: ''
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'general': return 'bg-gray-100 text-gray-800';
      case 'project': return 'bg-purple-100 text-purple-800';
      case 'department': return 'bg-orange-100 text-orange-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Loading meetings...</div>;
  }

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Users className="h-5 w-5 text-primary" />
            Meetings
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Meeting</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title *</Label>
                  <Input
                    id="title"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                    placeholder="Enter meeting title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newMeeting.description}
                    onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                    placeholder="Enter meeting description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Meeting Type</Label>
                  <Select value={newMeeting.meeting_type} onValueChange={(value: any) => setNewMeeting({ ...newMeeting, meeting_type: value })}>
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
                    <Label htmlFor="start-time">Start Time *</Label>
                    <Input
                      id="start-time"
                      type="datetime-local"
                      value={newMeeting.start_time}
                      onChange={(e) => setNewMeeting({ ...newMeeting, start_time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time *</Label>
                    <Input
                      id="end-time"
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
                    placeholder="Conference Room A or Virtual"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-url">Meeting URL</Label>
                  <Input
                    id="meeting-url"
                    value={newMeeting.meeting_url}
                    onChange={(e) => setNewMeeting({ ...newMeeting, meeting_url: e.target.value })}
                    placeholder="https://meet.google.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agenda">Agenda</Label>
                  <Textarea
                    id="agenda"
                    value={newMeeting.agenda}
                    onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
                    placeholder="Meeting agenda items..."
                  />
                </div>

                <Button onClick={handleCreateMeeting} className="w-full" disabled={createMeeting.isPending}>
                  {createMeeting.isPending ? "Scheduling..." : "Schedule Meeting"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {meetings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No meetings scheduled. Schedule your first meeting to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <Card key={meeting.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{meeting.title}</h4>
                        {meeting.description && (
                          <p className="text-sm text-muted-foreground">{meeting.description}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Organized by: {meeting.organizer?.full_name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(meeting.status)}>
                          {meeting.status}
                        </Badge>
                        <Badge className={getTypeColor(meeting.meeting_type)}>
                          {meeting.meeting_type}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(meeting.start_time), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(meeting.start_time), 'HH:mm')} - {format(new Date(meeting.end_time), 'HH:mm')}
                        </span>
                      </div>
                      {meeting.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{meeting.location}</span>
                        </div>
                      )}
                    </div>

                    {meeting.meeting_url && (
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={meeting.meeting_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          Join Meeting
                        </a>
                      </div>
                    )}

                    {meeting.agenda && (
                      <div className="mt-3 p-3 bg-muted/50 rounded">
                        <p className="text-sm">
                          <strong>Agenda:</strong> {meeting.agenda}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
