import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Users, FileText, BarChart, Archive } from "lucide-react";

export const AdminStats = () => {
  const stats = [
    {
      title: "Today's Activity",
      value: "$20.21K",
      change: "+14.5%",
      icon: BarChart,
    },
    {
      title: "Active Users",
      value: "2,847",
      change: "+12.4%",
      icon: Users,
    },
    {
      title: "Documents",
      value: "1,234",
      change: "+8.2%",
      icon: FileText,
    },
    {
      title: "Archives",
      value: "3,521",
      change: "+6.5%",
      icon: Archive,
    }
  ];

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <div className="flex items-baseline space-x-3">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <span className="flex items-center text-sm text-primary">
                    {stat.change}
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};