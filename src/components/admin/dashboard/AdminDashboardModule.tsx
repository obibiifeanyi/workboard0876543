
import { AdminStats } from "./AdminStats";
import { AdminPerformanceChart } from "./AdminPerformanceChart";
import { WorkProgressDonut } from "./WorkProgressDonut";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTabContent } from "./AdminTabContent";
import { Search, Settings } from "lucide-react";

export const AdminDashboardModule = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header Section */}
      <div className="flex items-center justify-between mb-8 p-6 rounded-3xl bg-gradient-to-r from-red-600/10 to-red-500/10 border border-red-600/20 backdrop-blur-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-600/20 backdrop-blur-sm">
              <Settings className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Management Center
              </h1>
              <p className="text-muted-foreground text-sm">Manage your organization with precision</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search across all systems..."
              className="w-full px-6 py-3 pl-12 rounded-full bg-white/80 dark:bg-black/20 
                       border border-red-600/30 focus:outline-none focus:ring-2 
                       focus:ring-red-600/50 focus:border-red-600/50
                       backdrop-blur-sm transition-all duration-300
                       hover:bg-white/90 dark:hover:bg-black/30"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-red-600/60" />
            <div className="absolute right-3 top-2.5 px-2 py-1 text-xs bg-red-600/10 text-red-600 rounded-full border border-red-600/20">
              Ctrl+K
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats and Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-white/80 to-white/40 dark:from-black/20 dark:to-black/10 
                         border border-red-600/20 backdrop-blur-sm shadow-lg">
            <AdminStats />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="p-4 rounded-3xl bg-gradient-to-br from-white/80 to-white/40 dark:from-black/20 dark:to-black/10 
                         border border-red-600/20 backdrop-blur-sm shadow-lg">
            <AdminPerformanceChart />
          </div>
          <div className="p-4 rounded-3xl bg-gradient-to-br from-white/80 to-white/40 dark:from-black/20 dark:to-black/10 
                         border border-red-600/20 backdrop-blur-sm shadow-lg">
            <WorkProgressDonut />
          </div>
        </div>
      </div>

      {/* Enhanced Tab System */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="p-2 rounded-3xl bg-gradient-to-r from-red-600/5 to-red-500/5 border border-red-600/20 backdrop-blur-sm">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 gap-2 bg-transparent p-1">
            <TabsTrigger 
              value="overview" 
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="projects"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="time"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25"
            >
              Time
            </TabsTrigger>
            <TabsTrigger 
              value="leave"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25"
            >
              Leave
            </TabsTrigger>
            <TabsTrigger 
              value="communication"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25"
            >
              Communication
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25"
            >
              API Keys
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-white/90 to-white/60 dark:from-black/30 dark:to-black/20 
                       backdrop-blur-xl border border-red-600/20 shadow-2xl shadow-red-600/10 p-8">
          <AdminTabContent />
        </div>
      </Tabs>
    </div>
  );
};
