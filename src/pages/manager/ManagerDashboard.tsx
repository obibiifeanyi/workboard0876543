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
      <div className="space-y-6 animate-fade-in p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back to your dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 rounded-full bg-black/10 dark:bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full text-[10px] flex items-center justify-center text-white">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuItem>New task assigned</DropdownMenuItem>
                <DropdownMenuItem>Report ready</DropdownMenuItem>
                <DropdownMenuItem>System update</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <ManagerStats />
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="ghost">
                <FileText className="mr-2 h-4 w-4" />
                Create New Report
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <Users className="mr-2 h-4 w-4" />
                Team Overview
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <BarChart className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>

        <DocumentAnalytics />

        <Tabs defaultValue="time" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-9 gap-2 bg-black/20 p-1 rounded-xl">
            <TabsTrigger value="time" className="rounded-lg data-[state=active]:bg-primary">
              Time Logs
            </TabsTrigger>
            <TabsTrigger value="workboard" className="rounded-lg data-[state=active]:bg-primary">
              Work Board
            </TabsTrigger>
            <TabsTrigger value="leave" className="rounded-lg data-[state=active]:bg-primary">
              Leave
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-lg data-[state=active]:bg-primary">
              Team
            </TabsTrigger>
            <TabsTrigger value="sites" className="rounded-lg data-[state=active]:bg-primary">
              Sites
            </TabsTrigger>
            <TabsTrigger value="reports" className="rounded-lg data-[state=active]:bg-primary">
              Reports
            </TabsTrigger>
            <TabsTrigger value="memos" className="rounded-lg data-[state=active]:bg-primary">
              Memos
            </TabsTrigger>
            <TabsTrigger value="invoices" className="rounded-lg data-[state=active]:bg-primary">
              Invoices
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-primary">
              Settings
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 bg-black/10 dark:bg-white/5 rounded-3xl p-6">
            <ManagerTabContent />
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
