import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCards } from "@/components/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Calendar 
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

const ManagerDashboard = () => {
  const stats = [
    {
      title: "Team Members",
      value: "8",
      description: "Active members",
      icon: Users,
    },
    {
      title: "Completed Tasks",
      value: "45",
      description: "This month",
      icon: CheckCircle,
    },
    {
      title: "Pending Tasks",
      value: "12",
      description: "Requires attention",
      icon: Clock,
    },
    {
      title: "Urgent Items",
      value: "3",
      description: "High priority",
      icon: AlertCircle,
    },
  ];

  const teamTasks = [
    { task: "Site Inspection", assignee: "John Doe", deadline: "2024-03-20", status: "In Progress" },
    { task: "Report Compilation", assignee: "Jane Smith", deadline: "2024-03-25", status: "Pending" },
  ];

  const teamMembers = [
    { name: "John Doe", role: "Engineer", status: "Online" },
    { name: "Jane Smith", role: "Technician", status: "Away" },
    { name: "Mike Johnson", role: "Analyst", status: "Offline" },
  ];

  return (
    <DashboardLayout title="Manager Dashboard">
      <div className="space-y-6">
        <StatsCards stats={stats} />

        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tasks">Team Tasks</TabsTrigger>
            <TabsTrigger value="team">Team Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Team Tasks</h2>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamTasks.map((task) => (
                      <TableRow key={task.task}>
                        <TableCell>{task.task}</TableCell>
                        <TableCell>{task.assignee}</TableCell>
                        <TableCell>{task.deadline}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Team Members</h2>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                View Schedule
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <Card key={member.name}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <span className={`text-xs ${
                          member.status === "Online" 
                            ? "text-green-500" 
                            : member.status === "Away" 
                            ? "text-yellow-500" 
                            : "text-gray-500"
                        }`}>
                          {member.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Site Reports</h2>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-semibold">No reports generated</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate a report to view analytics and insights
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;