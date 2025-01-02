import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ProfileSection = () => {
  const { toast } = useToast();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="h-10 w-10 text-primary" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold">John Doe</h3>
            <p className="text-sm text-muted-foreground">Technical Staff</p>
            <p className="text-sm text-muted-foreground">john.doe@company.com</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              toast({
                title: "Profile Update",
                description: "Profile update functionality coming soon.",
              });
            }}
          >
            Update Profile
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              toast({
                title: "Password Change",
                description: "Password change functionality coming soon.",
              });
            }}
          >
            Change Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};