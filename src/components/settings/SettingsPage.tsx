
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSettings } from "./UserSettings";
import { NotificationSettings } from "./NotificationSettings";
import { SecuritySettings } from "./SecuritySettings";
import { SystemSettings } from "./SystemSettings";
import { User, Bell, Shield, Settings } from "lucide-react";

export const SettingsPage = () => {
  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account and system preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <div className="p-2 rounded-3xl bg-gradient-to-r from-red-600/5 to-red-500/5 
                       border border-red-600/20 backdrop-blur-sm overflow-x-auto">
          <TabsList className="grid w-full grid-cols-4 gap-2 bg-transparent p-1 min-w-[600px] md:min-w-0">
            <TabsTrigger 
              value="profile"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25 text-xs md:text-sm"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25 text-xs md:text-sm"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25 text-xs md:text-sm"
            >
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="system"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25 text-xs md:text-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-white/90 to-white/60 dark:from-black/30 dark:to-black/20 
                       backdrop-blur-xl border border-red-600/20 shadow-2xl shadow-red-600/10 p-6 overflow-hidden">
          <TabsContent value="profile" className="mt-0">
            <UserSettings />
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="system" className="mt-0">
            <SystemSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
