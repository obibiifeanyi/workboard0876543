
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bell, Mail, MessageSquare, Save } from "lucide-react";

export const NotificationSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    memo_notifications: true,
    task_notifications: true,
    meeting_notifications: true,
    report_notifications: true
  });

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['notification_preferences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  useEffect(() => {
    if (preferences) {
      setSettings({
        email_notifications: preferences.email_notifications ?? true,
        push_notifications: preferences.push_notifications ?? true,
        memo_notifications: preferences.memo_notifications ?? true,
        task_notifications: preferences.task_notifications ?? true,
        meeting_notifications: preferences.meeting_notifications ?? true,
        report_notifications: preferences.report_notifications ?? true
      });
    }
  }, [preferences]);

  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: typeof settings) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...data
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification_preferences'] });
      toast({
        title: "Success",
        description: "Notification preferences updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update preferences",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updatePreferencesMutation.mutate(settings);
  };

  if (isLoading) {
    return (
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardContent className="p-6">
          <div className="text-center">Loading preferences...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Bell className="h-5 w-5 text-primary" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={settings.email_notifications}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, email_notifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications in browser
              </p>
            </div>
            <Switch
              checked={settings.push_notifications}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, push_notifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Memo Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when you receive new memos
              </p>
            </div>
            <Switch
              checked={settings.memo_notifications}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, memo_notifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Task Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about task assignments and updates
              </p>
            </div>
            <Switch
              checked={settings.task_notifications}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, task_notifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Meeting Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about upcoming meetings
              </p>
            </div>
            <Switch
              checked={settings.meeting_notifications}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, meeting_notifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Report Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about report submissions and approvals
              </p>
            </div>
            <Switch
              checked={settings.report_notifications}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, report_notifications: checked }))
              }
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={updatePreferencesMutation.isPending}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
          >
            <Save className="h-4 w-4 mr-2" />
            {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
