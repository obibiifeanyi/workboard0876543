import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useStaffOperations } from "@/hooks/useStaffOperations";
import { FormEvent } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

interface MeetingFormProps {
  onSubmit: (meetingData: {
    title: string;
    description?: string;
    meeting_type: string;
    location?: string;
    meeting_url?: string;
    start_time: string;
    end_time: string;
    agenda?: string;
    status: string;
  }) => void;
  onCancel?: () => void;
}

export const MeetingCenter = () => {
  const { useMeetings, createMeeting } = useStaffOperations();
  const { data: meetings = [], isLoading } = useMeetings();
  const { toast } = useToast();
  
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meeting_type: 'general',
    location: '',
    meeting_url: '',
    start_time: new Date().toISOString().slice(0, 16),
    end_time: new Date().toISOString().slice(0, 16),
    agenda: ''
  });
  
  // Reset success state after delay
  if (isSuccess) {
    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    
    // Validate form fields
    if (!formData.title.trim()) {
      setErrorMessage('Meeting title is required');
      setIsSubmitting(false);
      toast({
        title: 'Validation Error',
        description: 'Meeting title is required.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.start_time || !formData.end_time) {
      setErrorMessage('Start and end times are required');
      setIsSubmitting(false);
      toast({
        title: 'Validation Error',
        description: 'Start and end times are required.',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate end time is after start time
    if (new Date(formData.end_time) <= new Date(formData.start_time)) {
      setErrorMessage('End time must be after start time');
      setIsSubmitting(false);
      toast({
        title: 'Validation Error',
        description: 'End time must be after start time.',
        variant: 'destructive',
      });
      return;
    }
    
    // Call the mutation
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
    }, {
      onSuccess: () => {
        setIsSuccess(true);
        setIsSubmitting(false);
        toast({
          title: 'Meeting Scheduled',
          description: 'Your meeting has been scheduled successfully.',
        });
        
        // Reset form
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
        
        // Reset success state after a delay
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      },
      onError: (error: any) => {
        setIsSubmitting(false);
        setErrorMessage(error?.message || 'Failed to schedule meeting');
        toast({
          title: 'Error',
          description: error?.message || 'Failed to schedule meeting.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule New Meeting</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Meeting title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about the meeting"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting_type">Meeting Type *</Label>
            <Select 
              value={formData.meeting_type} 
              onValueChange={(value) => setFormData({ ...formData, meeting_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select meeting type" />
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
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Meeting location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting_url">Meeting URL</Label>
            <Input
              id="meeting_url"
              type="url"
              value={formData.meeting_url}
              onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
              placeholder="https://meet.google.com/xyz"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time *</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agenda">Agenda</Label>
            <Textarea
              id="agenda"
              value={formData.agenda}
              onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
              placeholder="Meeting agenda items"
            />
          </div>

          {/* Form feedback messages */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}
          
          {isSuccess && (
            <div className="flex items-center gap-2 text-green-500 text-sm">
              <CheckCircle size={16} />
              <span>Meeting scheduled successfully!</span>
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className={isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
