
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Save, Bell, Shield } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AccountSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    auto_approve_limit: 0,
    email_notifications: true,
    require_dual_approval: false,
    default_approval_workflow: 'standard'
  });

  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ['accountant_settings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('accountant_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  useEffect(() => {
    if (currentSettings) {
      setSettings({
        auto_approve_limit: currentSettings.auto_approve_limit || 0,
        email_notifications: currentSettings.email_notifications ?? true,
        require_dual_approval: currentSettings.require_dual_approval ?? false,
        default_approval_workflow: currentSettings.default_approval_workflow || 'standard'
      });
    }
  }, [currentSettings]);

  const saveSettingsMutation = useMutation({
    mutationFn: async (settingsData: typeof settings) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('accountant_settings')
        .upsert({
          user_id: user.id,
          ...settingsData
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountant_settings'] });
      toast({
        title: "Success",
        description: "Settings saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      });
    },
  });

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(settings);
  };

  if (isLoading) {
    return (
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Settings className="h-5 w-5 text-primary" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Settings className="h-5 w-5 text-primary" />
          Account Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Approval Settings */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Approval Settings
            </h3>
            
            <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-primary/20">
              <div className="space-y-2">
                <label className="text-sm font-medium">Auto-Approve Limit (₦)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={settings.auto_approve_limit}
                  onChange={(e) => setSettings(prev => ({ ...prev, auto_approve_limit: parseFloat(e.target.value) || 0 }))}
                />
                <p className="text-xs text-muted-foreground">
                  Invoices below this amount will be auto-approved
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Default Approval Workflow</label>
                <Select 
                  value={settings.default_approval_workflow} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, default_approval_workflow: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Review</SelectItem>
                    <SelectItem value="expedited">Expedited Review</SelectItem>
                    <SelectItem value="detailed">Detailed Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Require Dual Approval</label>
                  <p className="text-xs text-muted-foreground">
                    Require two approvers for high-value transactions
                  </p>
                </div>
                <Switch
                  checked={settings.require_dual_approval}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, require_dual_approval: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notification Settings
            </h3>
            
            <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email Notifications</label>
                  <p className="text-xs text-muted-foreground">
                    Receive email notifications for pending approvals
                  </p>
                </div>
                <Switch
                  checked={settings.email_notifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email_notifications: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              disabled={saveSettingsMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {saveSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
