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
  AlertCircle 
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

const AdminDashboard = () => {
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

  const recentProjects = [
    { name: "Site Maintenance A", status: "In Progress", deadline: "2024-03-20" },
    { name: "Network Upgrade B", status: "Pending", deadline: "2024-03-25" },
    { name: "Tower Installation", status: "Completed", deadline: "2024-03-15" },
  ];

  const leaveRequests = [
    { employee: "John Doe", type: "Annual", from: "2024-03-20", to: "2024-03-25" },
    { employee: "Jane Smith", type: "Sick", from: "2024-03-18", to: "2024-03-19" },
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        <StatsCards stats={stats} />

        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="leave">Leave Requests</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Projects</h2>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentProjects.map((project) => (
                      <TableRow key={project.name}>
                        <TableCell>{project.name}</TableCell>
                        <TableCell>{project.status}</TableCell>
                        <TableCell>{project.deadline}</TableCell>
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

          <TabsContent value="leave" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Leave Requests</h2>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request.employee}>
                        <TableCell>{request.employee}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>{request.from}</TableCell>
                        <TableCell>{request.to}</TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="outline" size="sm" className="bg-green-500/10 hover:bg-green-500/20 text-green-500">
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="bg-red-500/10 hover:bg-red-500/20 text-red-500">
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Document Archive</h2>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-semibold">No documents yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload documents to start building your archive
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

export default AdminDashboard;