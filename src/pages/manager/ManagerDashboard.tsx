
import { DashboardLayout } from "@/components/DashboardLayout";
import { ManagerNavigation } from "@/components/manager/ManagerNavigation";
import { TeamOverview } from "@/components/manager/TeamOverview";
import { ProjectManagement } from "@/components/manager/ProjectManagement";
import { TaskAssignment } from "@/components/manager/TaskAssignment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIDocumentButton } from "@/components/shared/AIDocumentButton";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";

const ManagerDashboard = () => {
  return (
    <DashboardLayout
      title="Manager Dashboard"
      navigation={<ManagerNavigation />}
    >
      <div className="flex justify-between items-center mb-6">
        <div />
        <div className="flex gap-4">
          <AIDocumentButton />
          <BackToAdminButton />
        </div>
      </div>

      <Tabs defaultValue="team" className="space-y-6">
        <div className="p-2 rounded-3xl bg-gradient-to-r from-red-600/5 to-red-500/5 
                       border border-red-600/20 backdrop-blur-sm">
          <TabsList className="grid w-full grid-cols-3 gap-2 bg-transparent p-1">
            <TabsTrigger 
              value="team"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25"
            >
              Team Overview
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
              value="tasks"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25"
            >
              Task Assignment
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-white/90 to-white/60 dark:from-black/30 dark:to-black/20 
                       backdrop-blur-xl border border-red-600/20 shadow-2xl shadow-red-600/10 p-6">
          <TabsContent value="team" className="space-y-4 mt-0">
            <TeamOverview />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4 mt-0">
            <ProjectManagement />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4 mt-0">
            <TaskAssignment />
          </TabsContent>
        </div>
      </Tabs>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
