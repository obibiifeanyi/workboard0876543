import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building, Users, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DepartmentRow } from "@/integrations/supabase/types/department";
import type { SystemActivityInsert } from "@/integrations/supabase/types/system";

export const DepartmentManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: departments } = useQuery<DepartmentRow[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *,
          profiles:manager_id (full_name)
        `);
      if (error) throw error;
      return data;
    },
  });

  const createActivityLog = async (description: string) => {
    const activityData: SystemActivityInsert = {
      type: 'department',
      description,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    };

    const { error } = await supabase
      .from('system_activities')
      .insert(activityData);
    
    if (error) throw error;
  };

  const handleAction = async (id: string, action: string) => {
    try {
      await createActivityLog(`${action} department ${id}`);
      toast({
        title: "Department Action",
        description: `${action} department ${id}`,
      });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform action",
        variant: "destructive",
      });
    }
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
            onClick={() => handleAction("new", "Add")}
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
                <p className="text-2xl font-bold">{departments?.length || 0}</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Total Employees</p>
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">
                  {departments?.reduce((acc, dept) => acc + (dept.employee_count || 0), 0) || 0}
                </p>
              </CardContent>
            </Card>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Head</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments?.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>{dept.profiles?.full_name || 'Not assigned'}</TableCell>
                  <TableCell>{dept.employee_count || 0}</TableCell>
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