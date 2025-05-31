
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ManagerNavigation } from "@/components/manager/ManagerNavigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AIDocumentButton } from "@/components/shared/AIDocumentButton";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";
import { ManagerTabContent } from "@/components/manager/dashboard/ManagerTabContent";

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("team");

  return (
    <DashboardLayout
      title="Manager Dashboard"
      navigation={
        <ManagerNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      }
    >
      <div className="flex justify-between items-center mb-6">
        <div />
        <div className="flex gap-4">
          <AIDocumentButton />
          <BackToAdminButton />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-white/90 to-white/60 dark:from-black/30 dark:to-black/20 
                       backdrop-blur-xl border border-red-600/20 shadow-2xl shadow-red-600/10 p-6">
          <ManagerTabContent />
        </div>
      </Tabs>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
