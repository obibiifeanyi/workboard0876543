import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, ListTodo, MapPin, BarChart } from "lucide-react";
import { AdminStats } from "@/components/admin/dashboard/AdminStats";
import { AdminPerformanceChart } from "@/components/admin/dashboard/AdminPerformanceChart";
import { WorkProgressDonut } from "@/components/admin/dashboard/WorkProgressDonut";
import { ActivityOverview } from "@/components/admin/ActivityOverview";

export const AdminDashboardModule = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="hover:bg-background/80"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStats />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminPerformanceChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Work Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkProgressDonut />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityOverview />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};