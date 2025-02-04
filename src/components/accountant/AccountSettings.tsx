import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export const AccountSettings = () => {
  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Settings className="h-5 w-5 text-primary" />
          Account Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Implement account settings UI here */}
        <div>Account settings content will go here</div>
      </CardContent>
    </Card>
  );
};