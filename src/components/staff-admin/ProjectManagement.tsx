import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  status: string;
  dueDate: string;
  manager: string;
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "New Tower Installation",
    status: "In Progress",
    dueDate: "2024-07-15",
    manager: "Alice Johnson",
  },
  {
    id: "2",
    name: "Network Upgrade - Phase 1",
    status: "Completed",
    dueDate: "2024-05-30",
    manager: "Bob Williams",
  },
  {
    id: "3",
    name: "Data Center Relocation",
    status: "Pending",
    dueDate: "2024-08-01",
    manager: "Carol Davis",
  },
];

export const ProjectManagement = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Project Management</h2>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Projects</CardTitle>
          <Button><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                  </TableCell>
                  <TableCell>{project.dueDate}</TableCell>
                  <TableCell>{project.manager}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="mr-2"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}; 