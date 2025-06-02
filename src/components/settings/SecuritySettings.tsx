
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, Key, Lock, Save } from "lucide-react";

export const SecuritySettings = () => {
  const { toast } = useToast();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: typeof passwordData) => {
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      if (data.newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters');
      }

      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (error) throw error;
    },
    onSuccess: () => {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast({
        title: "Success",
        description: "Password updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      });
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    changePasswordMutation.mutate(passwordData);
  };

  const signOutAllDevicesMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Signed out from all devices successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign out",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Key className="h-5 w-5 text-primary" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>

            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
            >
              <Save className="h-4 w-4 mr-2" />
              {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Shield className="h-5 w-5 text-primary" />
            Session Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Sign Out All Devices</Label>
            <p className="text-sm text-muted-foreground">
              This will sign you out from all devices and sessions.
            </p>
            <Button
              onClick={() => signOutAllDevicesMutation.mutate()}
              disabled={signOutAllDevicesMutation.isPending}
              variant="destructive"
            >
              <Lock className="h-4 w-4 mr-2" />
              {signOutAllDevicesMutation.isPending ? 'Signing Out...' : 'Sign Out All Devices'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
