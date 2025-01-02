import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const AccountManagement = () => {
  const { toast } = useToast();

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password Changed",
      description: "Your password has been successfully changed.",
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-black border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+1 234 567 890" />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-black border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Security Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};