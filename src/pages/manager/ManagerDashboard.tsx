import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ClipboardList, 
  Calendar,
  Bell,
  Building2
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const ManagerDashboard = () => {
  const menuItems = [
    { title: "Team Members", icon: Users, count: "8" },
    { title: "Active Projects", icon: ClipboardList, count: "4" },
    { title: "Leave Requests", icon: Calendar, count: "2" },
    { title: "Telecom Sites", icon: Building2, count: "3" },
    { title: "Notifications", icon: Bell, count: "5" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manager Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Button variant="outline">Sign Out</Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card key={item.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                  {item.title}
                </CardTitle>
                <item.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{item.count}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;