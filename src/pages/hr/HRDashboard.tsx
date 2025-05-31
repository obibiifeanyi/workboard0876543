
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCards } from "@/components/StatsCards";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Users, Calendar, FileText, TrendingUp, Settings, 
  UserPlus, Clock, Award, MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HRNavigation } from "@/components/hr/HRNavigation";
import { EmployeeManagement } from "@/components/hr/EmployeeManagement";
import { HRLeaveManagement } from "@/components/hr/HRLeaveManagement";
import { PayrollManagement } from "@/components/hr/PayrollManagement";
import { PerformanceReviews } from "@/components/hr/PerformanceReviews";
import { HRReports } from "@/components/hr/HRReports";

const HRDashboard = () => {
  const { toast } = useToast();

  const stats = [
    {
      title: "Total Employees",
      value: "247",
      description: "Active employees",
      icon: Users,
    },
    {
      title: "Pending Leave Requests",
      value: "12",
      description: "Awaiting approval",
      icon: Calendar,
    },
    {
      title: "New Hires This Month",
      value: "8",
      description: "Onboarding in progress",
      icon: UserPlus,
    },
    {
      title: "Performance Reviews Due",
      value: "23",
      description: "This quarter",
      icon: Award,
    },
  ];

  return (
    <DashboardLayout 
      title="HR Dashboard"
      navigation={<HRNavigation />}
    >
      <Routes>
        <Route path="/" element={
          <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
            <div className="grid gap-4 md:gap-6">
              <StatsCards stats={stats} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="glass-card border-primary/20 h-24 text-lg font-semibold hover:border-primary/40 transition-all duration-300"
                onClick={() => toast({
                  title: "Employee Management",
                  description: "Navigate to employee management section",
                })}
              >
                <Users className="mr-2 h-5 w-5" />
                Employee Management
              </Button>

              <Button
                variant="outline"
                className="glass-card border-primary/20 h-24 text-lg font-semibold hover:border-primary/40 transition-all duration-300"
                onClick={() => toast({
                  title: "Leave Management",
                  description: "Navigate to leave management section",
                })}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Leave Management
              </Button>

              <Button
                variant="outline"
                className="glass-card border-primary/20 h-24 text-lg font-semibold hover:border-primary/40 transition-all duration-300"
                onClick={() => toast({
                  title: "Payroll",
                  description: "Navigate to payroll management",
                })}
              >
                <Clock className="mr-2 h-5 w-5" />
                Payroll
              </Button>

              <Button
                variant="outline"
                className="glass-card border-primary/20 h-24 text-lg font-semibold hover:border-primary/40 transition-all duration-300"
                onClick={() => toast({
                  title: "Performance Reviews",
                  description: "Navigate to performance reviews",
                })}
              >
                <Award className="mr-2 h-5 w-5" />
                Performance Reviews
              </Button>

              <Button
                variant="outline"
                className="glass-card border-primary/20 h-24 text-lg font-semibold hover:border-primary/40 transition-all duration-300"
                onClick={() => toast({
                  title: "HR Reports",
                  description: "Navigate to HR reports section",
                })}
              >
                <FileText className="mr-2 h-5 w-5" />
                HR Reports
              </Button>

              <Button
                variant="outline"
                className="glass-card border-primary/20 h-24 text-lg font-semibold hover:border-primary/40 transition-all duration-300"
                onClick={() => toast({
                  title: "Analytics",
                  description: "Navigate to HR analytics",
                })}
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Analytics
              </Button>

              <Button
                variant="outline"
                className="glass-card border-primary/20 h-24 text-lg font-semibold hover:border-primary/40 transition-all duration-300"
                onClick={() => toast({
                  title: "Employee Communications",
                  description: "Navigate to communications",
                })}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Communications
              </Button>

              <Button
                variant="outline"
                className="glass-card border-primary/20 h-24 text-lg font-semibold hover:border-primary/40 transition-all duration-300"
                onClick={() => toast({
                  title: "HR Settings",
                  description: "Navigate to HR settings",
                })}
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Button>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="employees">Employees</TabsTrigger>
                <TabsTrigger value="leave">Leave</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <div className="mt-6 bg-black/5 dark:bg-black/20 rounded-3xl p-4 md:p-6">
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-6">
                    <EmployeeManagement />
                  </div>
                </TabsContent>

                <TabsContent value="employees" className="space-y-4">
                  <EmployeeManagement />
                </TabsContent>

                <TabsContent value="leave" className="space-y-4">
                  <HRLeaveManagement />
                </TabsContent>

                <TabsContent value="reports" className="space-y-4">
                  <HRReports />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        } />
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/leave" element={<HRLeaveManagement />} />
        <Route path="/payroll" element={<PayrollManagement />} />
        <Route path="/performance" element={<PerformanceReviews />} />
        <Route path="/reports" element={<HRReports />} />
      </Routes>
    </DashboardLayout>
  );
};

export default HRDashboard;
