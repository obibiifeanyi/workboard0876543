
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManagerStats } from "@/components/manager/dashboard/ManagerStats";
import { ManagerTabContent } from "@/components/manager/dashboard/ManagerTabContent";
import { DocumentAnalytics } from "@/components/documents/DocumentAnalytics";
import { Search } from "lucide-react";
import { AIDocumentButton } from "@/components/shared/AIDocumentButton";
import { CreateSiteButton } from "@/components/shared/CreateSiteButton";
import { QuickActions } from "@/components/manager/QuickActions";
import { useEffect } from "react";

const ManagerDashboard = () => {
  useEffect(() => {
    // Listen for tab switch events from QuickActions
    const handleTabSwitch = (event: CustomEvent) => {
      const tabValue = event.detail;
      const tabElement = document.querySelector(`[data-value="${tabValue}"]`) as HTMLButtonElement;
      if (tabElement) {
        tabElement.click();
      }
    };

    window.addEventListener('switchTab', handleTabSwitch as EventListener);
    return () => {
      window.removeEventListener('switchTab', handleTabSwitch as EventListener);
    };
  }, []);

  return (
    <DashboardLayout title="Manager Dashboard">
      <div className="space-y-6 animate-fade-in p-6 bg-manager-muted/5">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-muted-foreground mt-1">Welcome back</p>
          </div>
          <div className="flex items-center gap-4">
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
            <AIDocumentButton />
            <CreateSiteButton />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <ManagerStats />
          </div>
          <QuickActions />
        </div>

        <DocumentAnalytics />

        <Tabs defaultValue="time" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-9 gap-2 bg-manager-primary/5 p-1 rounded-xl">
            <TabsTrigger 
              value="time" 
              data-value="time"
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Time Logs
            </TabsTrigger>
            <TabsTrigger 
              value="workboard"
              data-value="workboard"
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Work Board
            </TabsTrigger>
            <TabsTrigger 
              value="leave"
              data-value="leave"
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Leave
            </TabsTrigger>
            <TabsTrigger 
              value="team"
              data-value="team"
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Team
            </TabsTrigger>
            <TabsTrigger 
              value="sites"
              data-value="sites"
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Sites
            </TabsTrigger>
            <TabsTrigger 
              value="reports"
              data-value="reports"
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Reports
            </TabsTrigger>
            <TabsTrigger 
              value="memos"
              data-value="memos"
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Memos
            </TabsTrigger>
            <TabsTrigger 
              value="invoices"
              data-value="invoices"
              className="rounded-lg data-[state=active]:bg-manager-primary data-[state=active]:text-white"
            >
              Invoices
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              data-value="settings"
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
