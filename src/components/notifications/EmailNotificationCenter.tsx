import { useState } from "react";
import { Bell, Mail, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const EmailNotificationCenter = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    documentUpdates: true,
    aiAnalytics: true,
    systemAlerts: true,
  });
  const { toast } = useToast();

  const handleToggleNotification = (key: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Notification Settings Updated",
      description: `${key} notifications have been ${emailNotifications[key] ? 'disabled' : 'enabled'}.`,
    });
  };

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
            <h4 className="font-medium">Document Updates</h4>
            <p className="text-sm text-muted-foreground">
              Receive notifications when documents are modified
            </p>
          </div>
          <Switch
            checked={emailNotifications.documentUpdates}
            onCheckedChange={() => handleToggleNotification('documentUpdates')}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">AI Analytics</h4>
            <p className="text-sm text-muted-foreground">
              Get insights from AI analysis of your documents
            </p>
          </div>
          <Switch
            checked={emailNotifications.aiAnalytics}
            onCheckedChange={() => handleToggleNotification('aiAnalytics')}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">System Alerts</h4>
            <p className="text-sm text-muted-foreground">
              Important system notifications and updates
            </p>
          </div>
          <Switch
            checked={emailNotifications.systemAlerts}
            onCheckedChange={() => handleToggleNotification('systemAlerts')}
          />
        </div>
      </CardContent>
    </Card>
  );
};