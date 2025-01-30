import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManagerStats } from "@/components/manager/dashboard/ManagerStats";
import { ManagerTabContent } from "@/components/manager/dashboard/ManagerTabContent";
import { DocumentAnalytics } from "@/components/documents/DocumentAnalytics";
import { Search, Bell, Settings, FileText, Users, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ManagerDashboard = () => {
  return (
    <DashboardLayout title="Manager Dashboard">
      <div className="space-y-6 animate-fade-in p-6 bg-manager-muted/5">
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 rounded-full bg-white/10 dark:bg-black/5 
                       border border-manager-accent/20 focus:outline-none focus:ring-2 
                       focus:ring-manager-primary/50"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-manager-primary" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-manager-secondary rounded-full text-[10px] flex items-center justify-center text-white">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white/95 dark:bg-black/95 backdrop-blur-lg">
                <DropdownMenuItem>New task assigned</DropdownMenuItem>
                <DropdownMenuItem>Report ready</DropdownMenuItem>
                <DropdownMenuItem>System update</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-manager-primary" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <ManagerStats />
          </div>
          <div className="glass-card p-6 bg-gradient-to-br from-manager-primary/10 to-manager-secondary/5">
            <h3 className="text-lg font-semibold mb-4 text-manager-primary">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="ghost">
                <FileText className="mr-2 h-4 w-4 text-manager-secondary" />
                Create New Report
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <Users className="mr-2 h-4 w-4 text-manager-secondary" />
                Team Overview
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <BarChart className="mr-2 h-4 w-4 text-manager-secondary" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>

        <DocumentAnalytics />

        <Tabs defaultValue="time" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-9 gap-2 bg-manager-primary/5 p-1 rounded-xl">
            <TabsTrigger 
              value="time" 
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Time Logs
            </TabsTrigger>
            <TabsTrigger 
              value="workboard"
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Work Board
            </TabsTrigger>
            <TabsTrigger 
              value="leave"
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Leave
            </TabsTrigger>
            <TabsTrigger 
              value="team"
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Team
            </TabsTrigger>
            <TabsTrigger 
              value="sites"
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Sites
            </TabsTrigger>
            <TabsTrigger 
              value="reports"
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Reports
            </TabsTrigger>
            <TabsTrigger 
              value="memos"
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Memos
            </TabsTrigger>
            <TabsTrigger 
              value="invoices"
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Invoices
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 bg-manager-primary/5 backdrop-blur-xl rounded-3xl p-6 border border-manager-accent/20">
            <ManagerTabContent />
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;