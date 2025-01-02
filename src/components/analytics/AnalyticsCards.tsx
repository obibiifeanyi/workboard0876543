import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCards } from "@/components/StatsCards";
import { BarChart, FileText, Users, Archive } from "lucide-react";

export const AnalyticsCards = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      description: "+12% from last month",
      icon: Users,
    },
    {
      title: "Active Documents",
      value: "1,234",
      description: "423 added this month",
      icon: FileText,
    },
    {
      title: "Memo Count",
      value: "847",
      description: "147 pending review",
      icon: BarChart,
    },
    {
      title: "Archived Items",
      value: "3,521",
      description: "Last archived: 2h ago",
      icon: Archive,
    },
  ];

  return (
    <div className="space-y-8">
      <StatsCards stats={stats} />
    </div>
  );
};