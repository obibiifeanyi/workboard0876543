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
  Calendar,
  BarChart,
  Target
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

const ManagerDashboard = () => {
  const { toast } = useToast();

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
      title: "Team Performance",
      value: "92%",
      description: "Efficiency rate",
      icon: Target,
    },
  ];

  const handleAction = (action: string, item: string) => {
    toast({
      title: "Action Triggered",
      description: `${action} action for ${item}`,
    });
  };

  return (
    <DashboardLayout title="Manager Dashboard">
      <div className="space-y-6 animate-fade-in">
        <StatsCards stats={stats} />

        <Tabs defaultValue="team" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
            <TabsTrigger value="team">Team Overview</TabsTrigger>
            <TabsTrigger value="tasks">Task Management</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "John Doe", role: "Senior Developer", status: "Online" },
                    { name: "Jane Smith", role: "Designer", status: "Away" },
                    { name: "Mike Johnson", role: "Developer", status: "Offline" },
                  ].map((member) => (
                    <Card key={member.name} className="bg-muted/50">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Task Management</h2>
              <Button onClick={() => handleAction("create", "new task")}>
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
                    {[
                      { task: "Feature Implementation", assignee: "John Doe", deadline: "2024-03-20", status: "In Progress" },
                      { task: "UI Design Review", assignee: "Jane Smith", deadline: "2024-03-25", status: "Pending" },
                      { task: "Bug Fixes", assignee: "Mike Johnson", deadline: "2024-03-18", status: "Completed" },
                    ].map((task) => (
                      <TableRow key={task.task}>
                        <TableCell>{task.task}</TableCell>
                        <TableCell>{task.assignee}</TableCell>
                        <TableCell>{task.deadline}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            task.status === "Completed" 
                              ? "bg-green-500/10 text-green-500" 
                              : task.status === "In Progress"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}>
                            {task.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAction("view", task.task)}
                          >
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

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Team Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { metric: "Task Completion Rate", value: "92%" },
                      { metric: "Average Response Time", value: "2.5 hours" },
                      { metric: "Team Satisfaction", value: "4.8/5" },
                    ].map((metric) => (
                      <div key={metric.metric} className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                        <span className="font-medium">{metric.metric}</span>
                        <span className="text-primary">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Goals & Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { goal: "Project Deliverables", progress: "75%" },
                      { goal: "Team Training", progress: "60%" },
                      { goal: "Quality Metrics", progress: "90%" },
                    ].map((goal) => (
                      <div key={goal.goal} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{goal.goal}</span>
                          <span className="text-sm text-muted-foreground">{goal.progress}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: goal.progress }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;