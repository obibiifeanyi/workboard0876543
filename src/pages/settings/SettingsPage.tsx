import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export const SettingsPage = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6 p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">System Settings</h1>
          <Button onClick={handleSave} className="rounded-xl">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-black/10 border-none shadow-lg rounded-2xl hover:bg-black/20 transition-all dark:bg-white/5 dark:hover:bg-white/10">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifs">Email Notifications</Label>
                <Switch id="email-notifs" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifs">Push Notifications</Label>
                <Switch id="push-notifs" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/10 border-none shadow-lg rounded-2xl hover:bg-black/20 transition-all dark:bg-white/5 dark:hover:bg-white/10">
            <CardHeader>
              <CardTitle>Display</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" placeholder="Select timezone" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="animations">Enable Animations</Label>
                <Switch id="animations" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;