
import { AdminStats } from "./AdminStats";
import { AdminPerformanceChart } from "./AdminPerformanceChart";
import { WorkProgressDonut } from "./WorkProgressDonut";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTabContent } from "./AdminTabContent";
import { Search, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AdminDashboardModule = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your organization</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 rounded-full bg-white/10 dark:bg-black/5 
                       border border-primary/20 focus:outline-none focus:ring-2 
                       focus:ring-primary/50"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-primary" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full text-[10px] flex items-center justify-center text-white">
                  5
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem>New user registration</DropdownMenuItem>
              <DropdownMenuItem>System alert</DropdownMenuItem>
              <DropdownMenuItem>Backup completed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-primary" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2">
          <AdminStats />
        </div>
        <div className="space-y-6">
          <AdminPerformanceChart />
          <WorkProgressDonut />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 gap-2 bg-primary/5 p-1 rounded-xl">
          <TabsTrigger 
            value="overview" 
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="users"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Users
          </TabsTrigger>
          <TabsTrigger 
            value="projects"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Projects
          </TabsTrigger>
          <TabsTrigger 
            value="time"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Time
          </TabsTrigger>
          <TabsTrigger 
            value="leave"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Leave
          </TabsTrigger>
          <TabsTrigger 
            value="communication"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Communication
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 bg-primary/5 backdrop-blur-xl rounded-3xl p-6 border border-primary/20">
          <AdminTabContent />
        </div>
      </Tabs>
    </div>
  );
};
