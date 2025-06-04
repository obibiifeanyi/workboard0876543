
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Plus, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const StaffActivityLogs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    activity_type: "",
    activity_description: "",
    duration_hours: "",
    location: "",
  });
  
  // Reset form data when success state changes
  useEffect(() => {
    if (isSuccess) {
      // Reset success state after a delay
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const { data: activities, isLoading } = useQuery({
    queryKey: ['staff-logs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from('staff_logs')
        .select('*')
        .eq('staff_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createActivity = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { error } = await supabase
        .from('staff_logs')
        .insert([{
          staff_id: user.id,
          activity_type: data.activity_type,
          activity_description: data.activity_description,
          duration_hours: data.duration_hours ? parseFloat(data.duration_hours) : null,
          location: data.location || null,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-logs'] });
      setIsDialogOpen(false);
      setFormData({
        activity_type: "",
        activity_description: "",
        duration_hours: "",
        location: "",
      });
      setIsSuccess(true);
      setIsSubmitting(false);
      toast({
        title: "Success",
        description: "Activity logged successfully",
      });
    },
    onError: (error: any) => {
      setIsSubmitting(false);
      setErrorMessage(error?.message || "Failed to log activity");
      toast({
        title: "Error",
        description: error?.message || "Failed to log activity",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    
    // Validate required fields
    if (!formData.activity_type || !formData.activity_description) {
      setErrorMessage("Activity type and description are required");
      setIsSubmitting(false);
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Call the mutation
    createActivity.mutate(formData);
  };

  return (
    <Card className="enhanced-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-unica">
            <Activity className="h-5 w-5 text-primary" />
            Activity Logs
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="button-enhanced">
                <Plus className="h-4 w-4 mr-2" />
                Log Activity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log New Activity</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="activity_type">Activity Type</Label>
                  <Select value={formData.activity_type} onValueChange={(value) => setFormData(prev => ({ ...prev, activity_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task">Task Work</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="site_visit">Site Visit</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="activity_description">Description</Label>
                  <Textarea
                    id="activity_description"
                    value={formData.activity_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, activity_description: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration_hours">Duration (Hours)</Label>
                  <Input
                    id="duration_hours"
                    type="number"
                    step="0.5"
                    value={formData.duration_hours}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging..." : "Log Activity"}
                </Button>
                {errorMessage && (
                  <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
                )}
                {isSuccess && (
                  <p className="text-green-600 text-xs mt-2">Activity logged successfully!</p>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : activities && activities.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="capitalize">{activity.activity_type}</TableCell>
                  <TableCell>{activity.activity_description}</TableCell>
                  <TableCell>
                    {activity.duration_hours ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {activity.duration_hours}h
                      </div>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>{activity.location || 'N/A'}</TableCell>
                  <TableCell>{new Date(activity.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No activities logged yet. Start logging your activities to track your work.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
