import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManagerStats } from "@/components/manager/dashboard/ManagerStats";
import { ManagerTabContent } from "@/components/manager/dashboard/ManagerTabContent";
import { ChatBox } from "@/components/ChatBox";
import { DocumentAnalytics } from "@/components/documents/DocumentAnalytics";
import { EnhancedNotificationCenter } from "@/components/notifications/EnhancedNotificationCenter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const ManagerDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <DashboardLayout title="Manager Dashboard">
      <div className="space-y-6 animate-fade-in p-4 sm:p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">My Dashboard</h1>
          
          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <nav className="flex flex-col gap-4">
                  <TabsList className="flex flex-col gap-2 bg-transparent">
                    <TabsTrigger value="time" className="w-full justify-start">
                      Time Logs
                    </TabsTrigger>
                    <TabsTrigger value="workboard" className="w-full justify-start">
                      Work Board
                    </TabsTrigger>
                    <TabsTrigger value="leave" className="w-full justify-start">
                      Leave
                    </TabsTrigger>
                    <TabsTrigger value="team" className="w-full justify-start">
                      Team
                    </TabsTrigger>
                    <TabsTrigger value="sites" className="w-full justify-start">
                      Sites
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="w-full justify-start">
                      Reports
                    </TabsTrigger>
                    <TabsTrigger value="memos" className="w-full justify-start">
                      Memos
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="w-full justify-start">
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </nav>
              </SheetContent>
            </Sheet>

            <div className="relative">
              <EnhancedNotificationCenter />
            </div>

            <div className="relative w-64 hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded-full bg-black/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        <ManagerStats />

        <DocumentAnalytics />

        <Tabs defaultValue="time" className="space-y-6">
          <TabsList className="hidden md:grid w-full grid-cols-2 md:grid-cols-8 gap-2 bg-black/20 p-1 rounded-xl">
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
            <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-primary">
              Settings
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 bg-black/10 rounded-3xl p-4 sm:p-6">
            <ManagerTabContent />
          </div>
        </Tabs>

        <ChatBox />
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;