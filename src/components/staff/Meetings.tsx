import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStaffOperations } from "@/hooks/useStaffOperations";

interface MeetingFormState {
  title: string;
  description?: string;
  meeting_type: string;
  location?: string;
  meeting_url?: string;
  start_time: string;
  end_time: string;
  agenda?: string;
}

export const Meetings = () => {
  const { useMeetings, createMeeting } = useStaffOperations();
  const { data: meetings = [], isLoading } = useMeetings();
  const { toast } = useToast();
  const [formData, setFormData] = useState<MeetingFormState>({
    title: '',
    description: '',
    meeting_type: 'general',
    location: '',
    meeting_url: '',
    start_time: new Date().toISOString().slice(0, 16),
    end_time: new Date().toISOString().slice(0, 16),
    agenda: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMeeting.mutate({
      title: formData.title,
      description: formData.description,
      meeting_type: formData.meeting_type as any,
      location: formData.location,
      meeting_url: formData.meeting_url,
      start_time: formData.start_time,
      end_time: formData.end_time,
      agenda: formData.agenda,
      status: 'scheduled' // Add default status
    });

    toast({
      title: "Meeting Scheduled",
      description: "Your meeting has been scheduled successfully.",
    });

    setFormData({
      title: '',
      description: '',
      meeting_type: 'general',
      location: '',
      meeting_url: '',
      start_time: new Date().toISOString().slice(0, 16),
      end_time: new Date().toISOString().slice(0, 16),
      agenda: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return <div>Loading meetings...</div>;
  }

  return (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Schedule a Meeting</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Meeting Title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Meeting Description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting_type">Meeting Type</Label>
            <Select
              value={formData.meeting_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, meeting_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a meeting type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Meeting Location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting_url">Meeting URL</Label>
            <Input
              type="url"
              id="meeting_url"
              name="meeting_url"
              value={formData.meeting_url}
              onChange={handleChange}
              placeholder="https://meet.google.com/xyz"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                type="datetime-local"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                type="datetime-local"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agenda">Agenda</Label>
            <Textarea
              id="agenda"
              name="agenda"
              value={formData.agenda}
              onChange={handleChange}
              placeholder="Meeting Agenda"
            />
          </div>

          <Button type="submit" className="w-full">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
