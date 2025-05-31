
import { useState, useEffect } from "react";
import { Mail, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NotificationPreferences {
  email_enabled: boolean;
  push_enabled: boolean;
  memo_notifications: boolean;
  task_notifications: boolean;
  leave_notifications: boolean;
  document_notifications: boolean;
}

export const EmailNotificationCenter = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_enabled: true,
    push_enabled: true,
    memo_notifications: true,
    task_notifications: true,
    leave_notifications: true,
    document_notifications: true,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching preferences:', error);
        return;
      }

      if (data) {
        setPreferences({
          email_enabled: data.email_enabled,
          push_enabled: data.push_enabled,
          memo_notifications: data.memo_notifications,
          task_notifications: data.task_notifications,
          leave_notifications: data.leave_notifications,
          document_notifications: data.document_notifications,
        });
      }
    } catch (error) {
      console.error('Preferences fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.user.id,
          [key]: value,
          ...preferences,
        });

      if (error) {
        console.error('Error updating preferences:', error);
        toast({
          title: "Error",
          description: "Failed to update notification preferences.",
          variant: "destructive",
        });
        return;
      }

      setPreferences(prev => ({ ...prev, [key]: value }));
      
      toast({
        title: "Preferences Updated",
        description: `${key.replace('_', ' ')} notifications have been ${value ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      console.error('Preference update error:', error);
    }
  };

  if (loading) {
    return (
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Email Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">Email Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Receive notifications via email
            </p>
          </div>
          <Switch
            checked={preferences.email_enabled}
            onCheckedChange={(value) => updatePreference('email_enabled', value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">Memo Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Get notified about new memos and updates
            </p>
          </div>
          <Switch
            checked={preferences.memo_notifications}
            onCheckedChange={(value) => updatePreference('memo_notifications', value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">Task Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Receive updates about task assignments and completions
            </p>
          </div>
          <Switch
            checked={preferences.task_notifications}
            onCheckedChange={(value) => updatePreference('task_notifications', value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">Leave Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Get notified about leave request updates
            </p>
          </div>
          <Switch
            checked={preferences.leave_notifications}
            onCheckedChange={(value) => updatePreference('leave_notifications', value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">Document Updates</h4>
            <p className="text-sm text-muted-foreground">
              Receive notifications when documents are modified
            </p>
          </div>
          <Switch
            checked={preferences.document_notifications}
            onCheckedChange={(value) => updatePreference('document_notifications', value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
