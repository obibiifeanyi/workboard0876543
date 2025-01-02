import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCards } from "@/components/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Briefcase, 
  Clock, 
  Building,
  FileText,
  Calendar,
  AlertCircle,
  Settings,
  Shield 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const { toast } = useToast();

  const stats = [
    {
      title: "Total Staff",
      value: "25",
      description: "Active employees",
      icon: Users,
    },
    {
      title: "Active Projects",
      value: "12",
      description: "In progress",
      icon: Briefcase,
    },
    {
      title: "Leave Requests",
      value: "5",
      description: "Pending approval",
      icon: Clock,
    },
    {
      title: "Telecom Sites",
      value: "8",
      description: "Operational",
      icon: Building,
    },
  ];

  const handleAction = (action: string, item: string) => {
    toast({
      title: "Action Triggered",
      description: `${action} action for ${item}`,
    });
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6 animate-fade-in">
        <StatsCards stats={stats} />

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>System Health</span>
                      <span className="text-green-500">Operational</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Last Backup</span>
                      <span>2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Server Load</span>
                      <span>42%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-2 rounded-lg bg-muted/50">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">System Update Required</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: "John Doe", role: "Manager", status: "Active" },
                      { name: "Jane Smith", role: "Staff", status: "Active" },
                    ].map((user) => (
                      <TableRow key={user.name}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.status}</TableCell>
                        <TableCell className="space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAction("edit", user.name)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive"
                            onClick={() => handleAction("delete", user.name)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Two-Factor Authentication", enabled: true },
                  { title: "Password Policy", enabled: true },
                  { title: "Login Monitoring", enabled: false },
                ].map((setting) => (
                  <div key={setting.title} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{setting.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {setting.enabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => handleAction("toggle", setting.title)}
                    >
                      Configure
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Email Notifications", description: "Configure system notification settings" },
                  { title: "Data Retention", description: "Manage data retention policies" },
                  { title: "API Access", description: "Manage API keys and permissions" },
                ].map((setting) => (
                  <div key={setting.title} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <h3 className="font-medium">{setting.title}</h3>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => handleAction("configure", setting.title)}
                    >
                      Configure
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;