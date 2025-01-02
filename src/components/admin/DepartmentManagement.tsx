import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building, Users, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockDepartments = [
  {
    id: 1,
    name: "Engineering",
    head: "John Doe",
    employees: 12,
    location: "Floor 3",
  },
  {
    id: 2,
    name: "Marketing",
    head: "Jane Smith",
    employees: 8,
    location: "Floor 2",
  },
];

export const DepartmentManagement = () => {
  const { toast } = useToast();

  const handleAction = (id: number, action: string) => {
    toast({
      title: "Department Action",
      description: `${action} department ${id}`,
    });
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Department Management
          </CardTitle>
          <Button
            onClick={() => handleAction(0, "Add")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Total Departments</p>
                  <Building className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">6</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Total Employees</p>
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">45</p>
              </CardContent>
            </Card>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Head</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDepartments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>{dept.head}</TableCell>
                  <TableCell>{dept.employees}</TableCell>
                  <TableCell>{dept.location}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction(dept.id, "Edit")}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleAction(dept.id, "Delete")}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};