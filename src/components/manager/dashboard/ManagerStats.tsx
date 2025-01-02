import { StatsCards } from "@/components/StatsCards";
import { Users, FileText, BarChart, Clock } from "lucide-react";

export const ManagerStats = () => {
  const stats = [
    {
      title: "Team Members",
      value: "12",
      description: "+2 this month",
      icon: Users,
    },
    {
      title: "Active Projects",
      value: "8",
      description: "3 due this week",
      icon: FileText,
    },
    {
      title: "Performance",
      value: "92%",
      description: "+5% from last month",
      icon: BarChart,
    },
    {
      title: "Time Tracked",
      value: "164h",
      description: "This month",
      icon: Clock,
    },
  ];

  return <StatsCards stats={stats} />;
};