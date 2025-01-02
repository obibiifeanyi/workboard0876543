import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ProfileSection = () => {
  const { toast } = useToast();

  return (
    <Card className="border-none shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src="/placeholder.svg" alt="Profile" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold">John Doe</h3>
              <p className="text-sm text-muted-foreground">Technical Staff</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>john.doe@company.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>+1 234 567 890</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>Main Office</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>9:00 AM - 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
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