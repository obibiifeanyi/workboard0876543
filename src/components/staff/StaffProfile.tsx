
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileSection } from "@/components/staff/ProfileSection";
import { User } from "lucide-react";

export const StaffProfile = () => {
  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <User className="h-6 w-6 text-primary" />
          Staff Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ProfileSection />
      </CardContent>
    </Card>
  );
};
