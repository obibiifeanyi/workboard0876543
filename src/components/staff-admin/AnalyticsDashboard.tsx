import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, PieChart, Users, Calendar, DollarSign, TrendingUp } from "lucide-react";

interface MetricCard {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
}

const metricCards: MetricCard[] = [
  {
    title: "Total Employees",
    value: "156",
    change: "+12% from last month",
    icon: Users,
  },
  {
    title: "Active Projects",
    value: "24",
    change: "+3 new this week",
    icon: Calendar,
  },
  {
    title: "Revenue",
    value: "$1.2M",
    change: "+8% from last quarter",
    icon: DollarSign,
  },
  {
    title: "Efficiency",
    value: "92%",
    change: "+5% improvement",
    icon: TrendingUp,
  },
];

export const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Analytics Dashboard</h2>
      
      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <BarChart className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Project Progress Chart</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <LineChart className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Revenue Trends Chart</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <PieChart className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Department Distribution Chart</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <BarChart className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Resource Utilization Chart</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Export Report
        </Button>
        <Button>
          <TrendingUp className="mr-2 h-4 w-4" />
          Generate Insights
        </Button>
      </div>
    </div>
  );
}; 