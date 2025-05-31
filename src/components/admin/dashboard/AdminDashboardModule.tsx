
import { AdminStats } from "./AdminStats";
import { AdminPerformanceChart } from "./AdminPerformanceChart";
import { WorkProgressDonut } from "./WorkProgressDonut";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTabContent } from "./AdminTabContent";
import { Search, Zap } from "lucide-react";

export const AdminDashboardModule = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header Section */}
      <div className="flex items-center justify-between mb-8 p-6 rounded-3xl bg-gradient-to-r from-admin-primary/10 to-admin-secondary/10 border border-admin-primary/20 backdrop-blur-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-admin-primary/20 backdrop-blur-sm">
              <Zap className="h-6 w-6 text-admin-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-admin-primary to-admin-secondary bg-clip-text text-transparent">
                Admin Command Center
              </h1>
              <p className="text-muted-foreground">Manage your organization with precision</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search across all systems..."
              className="w-full px-6 py-3 pl-12 rounded-full bg-white/80 dark:bg-black/20 
                       border border-admin-primary/30 focus:outline-none focus:ring-2 
                       focus:ring-admin-primary/50 focus:border-admin-primary/50
                       backdrop-blur-sm transition-all duration-300
                       hover:bg-white/90 dark:hover:bg-black/30"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-admin-primary/60" />
            <div className="absolute right-3 top-2.5 px-2 py-1 text-xs bg-admin-primary/10 text-admin-primary rounded-full border border-admin-primary/20">
              Ctrl+K
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats and Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-white/80 to-white/40 dark:from-black/20 dark:to-black/10 
                         border border-admin-primary/20 backdrop-blur-sm shadow-lg">
            <AdminStats />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="p-4 rounded-3xl bg-gradient-to-br from-white/80 to-white/40 dark:from-black/20 dark:to-black/10 
                         border border-admin-primary/20 backdrop-blur-sm shadow-lg">
            <AdminPerformanceChart />
          </div>
          <div className="p-4 rounded-3xl bg-gradient-to-br from-white/80 to-white/40 dark:from-black/20 dark:to-black/10 
                         border border-admin-primary/20 backdrop-blur-sm shadow-lg">
            <WorkProgressDonut />
          </div>
        </div>
      </div>

      {/* Enhanced Tab System */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="p-2 rounded-3xl bg-gradient-to-r from-admin-primary/5 to-admin-secondary/5 border border-admin-primary/20 backdrop-blur-sm">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 gap-2 bg-transparent p-1">
            <TabsTrigger 
              value="overview" 
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-admin-primary 
                       data-[state=active]:to-admin-secondary data-[state=active]:text-white
                       hover:bg-admin-primary/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-admin-primary/25"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-admin-primary 
                       data-[state=active]:to-admin-secondary data-[state=active]:text-white
                       hover:bg-admin-primary/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-admin-primary/25"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="projects"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-admin-primary 
                       data-[state=active]:to-admin-secondary data-[state=active]:text-white
                       hover:bg-admin-primary/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-admin-primary/25"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="time"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-admin-primary 
                       data-[state=active]:to-admin-secondary data-[state=active]:text-white
                       hover:bg-admin-primary/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-admin-primary/25"
            >
              Time
            </TabsTrigger>
            <TabsTrigger 
              value="leave"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-admin-primary 
                       data-[state=active]:to-admin-secondary data-[state=active]:text-white
                       hover:bg-admin-primary/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-admin-primary/25"
            >
              Leave
            </TabsTrigger>
            <TabsTrigger 
              value="communication"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-admin-primary 
                       data-[state=active]:to-admin-secondary data-[state=active]:text-white
                       hover:bg-admin-primary/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-admin-primary/25"
            >
              Communication
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-admin-primary 
                       data-[state=active]:to-admin-secondary data-[state=active]:text-white
                       hover:bg-admin-primary/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-admin-primary/25"
            >
              API Keys
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-white/90 to-white/60 dark:from-black/30 dark:to-black/20 
                       backdrop-blur-xl border border-admin-primary/20 shadow-2xl shadow-admin-primary/10 p-8">
          <AdminTabContent />
        </div>
      </Tabs>
    </div>
  );
};
