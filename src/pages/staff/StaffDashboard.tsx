import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCards } from "@/components/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Clock, 
  Calendar, 
  Bell,
  FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StaffDashboard = () => {
  const stats = [
    {
      title: "Tasks Completed",
      value: "15",
      description: "This week",
      icon: CheckCircle,
    },
    {
      title: "Hours Today",
      value: "6.5",
      description: "Out of 8 hours",
      icon: Clock,
    },
    {
      title: "Leave Balance",
      value: "12",
      description: "Days remaining",
      icon: Calendar,
    },
    {
      title: "Notifications",
      value: "4",
      description: "Unread messages",
      icon: Bell,
    },
  ];

  const myTasks = [
    { task: "Equipment Check", deadline: "2024-03-20", status: "In Progress" },
    { task: "Data Entry", deadline: "2024-03-25", status: "Pending" },
  ];

  return (
    <DashboardLayout title="Staff Dashboard">
      <div className="space-y-6">
        <StatsCards stats={stats} />

        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="leave">Leave Application</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myTasks.map((task) => (
                      <TableRow key={task.task}>
                        <TableCell>{task.task}</TableCell>
                        <TableCell>{task.deadline}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Apply for Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Select Dates
                    </Button>
                    <Button>
                      Submit Request
                    </Button>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Leave Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">12</p>
                          <p className="text-xs text-muted-foreground">Annual</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">5</p>
                          <p className="text-xs text-muted-foreground">Sick</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">3</p>
                          <p className="text-xs text-muted-foreground">Other</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">John Doe</h3>
                    <p className="text-sm text-muted-foreground">Technical Staff</p>
                    <p className="text-sm text-muted-foreground">john.doe@company.com</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;