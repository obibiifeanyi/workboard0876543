
import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ManagerNavigation } from "@/components/manager/ManagerNavigation";
import { Tabs } from "@/components/ui/tabs";
import { AIDocumentButton } from "@/components/shared/AIDocumentButton";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";
import { ManagerTabContent } from "@/components/manager/dashboard/ManagerTabContent";
import { NeuralNetwork } from "@/components/NeuralNetwork";
import { MainNavBar } from "@/components/navigation/MainNavBar";

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("team");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <NeuralNetwork />
      
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <ManagerNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          <SidebarInset className="flex-1">
            <MainNavBar 
              title="Manager Dashboard"
              actions={
                <div className="flex items-center space-x-2">
                  <AIDocumentButton />
                  <BackToAdminButton />
                </div>
              }
            />

            {/* Main Content */}
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <div className="rounded-3xl bg-gradient-to-br from-white/90 to-white/60 dark:from-black/30 dark:to-black/20 
                                 backdrop-blur-xl border border-red-600/20 shadow-2xl shadow-red-600/10 p-6">
                    <ManagerTabContent />
                  </div>
                </Tabs>
              </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="text-center text-sm text-muted-foreground">
                  Licensed By <span className="font-semibold text-primary">BMD Tech Hub</span> • 
                  Usage Rights by <span className="font-semibold text-primary">CT NIGERIA LTD</span> • 
                  © 2025 All Rights Reserved
                </div>
              </div>
            </footer>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ManagerDashboard;
