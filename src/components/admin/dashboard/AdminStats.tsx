import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Users, FileText, BarChart, Archive } from "lucide-react";

const formatNaira = (value: string) => {
  const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue * 1000); // Converting to thousands for larger numbers
};

export const AdminStats = () => {
  const stats = [
    {
      title: "Today's Activity",
      value: formatNaira("20.21"),
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
        <Card key={stat.title} className="border-admin-accent bg-white/50 backdrop-blur-sm transition-all hover:border-admin-primary/50 hover:shadow-lg hover:scale-[1.02] dark:bg-black/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <div className="flex items-baseline space-x-3">
                  <p className="text-xl sm:text-2xl font-bold text-admin-primary">{stat.value}</p>
                  <span className="flex items-center text-xs sm:text-sm text-admin-secondary">
                    {stat.change}
                    <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                  </span>
                </div>
              </div>
              <div className="p-2 bg-admin-accent rounded-lg">
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-admin-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};