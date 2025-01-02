import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TelecomSites } from "@/components/admin/TelecomSites";
import { ProjectManagement } from "@/components/admin/ProjectManagement";
import { LeaveManagement } from "@/components/admin/LeaveManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { DepartmentManagement } from "@/components/admin/DepartmentManagement";
import { ActivityManagement } from "@/components/admin/ActivityManagement";
import { TimeManagement } from "@/components/admin/TimeManagement";
import { AIManagementSystem } from "@/components/ai/AIManagementSystem";
import { AIKnowledgeBase } from "@/components/ai/AIKnowledgeBase";
import { AnalyticsCards } from "@/components/analytics/AnalyticsCards";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6 animate-fade-in">
        <div className="mb-8">
          <AnalyticsCards />
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Performance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Tabs defaultValue="time" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-9 lg:grid-cols-9 gap-4">
            <TabsTrigger value="time">Time Logs</TabsTrigger>
            <TabsTrigger value="ai">AI Management</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="telecom">Telecom Sites</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="leave">Leave Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="time" className="space-y-4">
            <TimeManagement />
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <AIManagementSystem />
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4">
            <AIKnowledgeBase />
          </TabsContent>

          <TabsContent value="telecom" className="space-y-4">
            <TelecomSites />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <ProjectManagement />
          </TabsContent>

          <TabsContent value="leave" className="space-y-4">
            <LeaveManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          <TabsContent value="departments" className="space-y-4">
            <DepartmentManagement />
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <ActivityManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
