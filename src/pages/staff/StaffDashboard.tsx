import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCards } from "@/components/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Clock, Calendar as CalendarIcon, CheckCircle, Bell } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

const StaffDashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const stats = [
    {
      title: "Hours Today",
      value: "6.5",
      description: "Out of 8 hours",
      icon: Clock,
    },
    {
      title: "Tasks Completed",
      value: "15",
      description: "This week",
      icon: CheckCircle,
    },
    {
      title: "Leave Balance",
      value: "12",
      description: "Days remaining",
      icon: CalendarIcon,
    },
    {
      title: "Notifications",
      value: "4",
      description: "Unread messages",
      icon: Bell,
    },
  ];

  const tasks = [
    { id: 1, task: "Equipment Check", deadline: "2024-03-20", status: "In Progress" },
    { id: 2, task: "Data Entry", deadline: "2024-03-25", status: "Pending" },
    { id: 3, task: "Site Inspection", deadline: "2024-03-22", status: "Completed" },
  ];

  const handleLeaveRequest = () => {
    if (date) {
      toast({
        title: "Leave Request Submitted",
        description: `Your leave request for ${date.toLocaleDateString()} has been submitted.`,
      });
    }
  };

  return (
    <DashboardLayout title="Staff Dashboard">
      <div className="space-y-6">
        <StatsCards stats={stats} />

        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="leave">Leave Application</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.task}</TableCell>
                        <TableCell>{task.deadline}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            task.status === 'Completed' 
                              ? 'bg-green-100 text-green-800' 
                              : task.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Task Updated",
                                description: `Task "${task.task}" status updated.`,
                              });
                            }}
                          >
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
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                  <div className="flex-1">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </div>
                  <Card className="flex-1">
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
                <Button onClick={handleLeaveRequest} className="w-full">
                  Submit Leave Request
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-10 w-10 text-primary" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-semibold">John Doe</h3>
                    <p className="text-sm text-muted-foreground">Technical Staff</p>
                    <p className="text-sm text-muted-foreground">john.doe@company.com</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <Button variant="outline" className="w-full" onClick={() => {
                    toast({
                      title: "Profile Update",
                      description: "Profile update functionality coming soon.",
                    });
                  }}>
                    Update Profile
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => {
                    toast({
                      title: "Password Change",
                      description: "Password change functionality coming soon.",
                    });
                  }}>
                    Change Password
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