import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building, Edit, Trash2, Plus, Users } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Department {
  id: string;
  name: string;
  description?: string;
  manager_id?: string;
  employee_count?: number;
  created_at: string;
  manager?: {
    full_name: string;
  } | null;
}

interface User {
  id: string;
  full_name: string;
}

export const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    description: "",
    manager_id: ""
  });
  const [managers, setManagers] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchDepartments();
    fetchPotentialManagers();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *,
          manager:profiles!manager_id(full_name)
        `)
        .order('name', { ascending: true });

      if (error) throw error;
      
      // Transform the data to handle the manager relationship correctly
      const transformedData = data?.map(dept => ({
        ...dept,
        manager: Array.isArray(dept.manager) && dept.manager.length > 0 
          ? dept.manager[0] 
          : dept.manager || null
      })) || [];
      
      setDepartments(transformedData);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch departments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPotentialManagers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('account_type', ['manager', 'admin'])
        .order('full_name');

      if (error) throw error;
      setManagers(data || []);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDept) {
        const { error } = await supabase
          .from('departments')
          .update({
            name: formData.name,
            description: formData.description,
            manager_id: formData.manager_id || null,
          })
          .eq('id', editingDept.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Department updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('departments')
          .insert({
            name: formData.name,
            description: formData.description,
            manager_id: formData.manager_id || null,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Department created successfully",
        });
      }

      resetForm();
      fetchDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
      toast({
        title: "Error",
        description: "Failed to save department",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormData({ 
      name: dept.name, 
      description: dept.description || "",
      manager_id: dept.manager_id || "" 
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;

    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Department deleted successfully",
      });

      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", manager_id: "" });
    setEditingDept(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border border-red-600/20 shadow-lg bg-gradient-to-br from-white/95 to-red-50/30">
        <CardHeader className="bg-gradient-to-r from-red-600/10 to-red-500/10 rounded-t-3xl border-b border-red-600/20">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Building className="h-5 w-5" />
            {editingDept ? "Edit Department" : "Add New Department"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-1 block text-red-700">Department Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter department name"
                  className="rounded-[30px] border-red-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-red-700">Department Manager</label>
                <Select 
                  value={formData.manager_id} 
                  onValueChange={(value) => setFormData({ ...formData, manager_id: value })}
                >
                  <SelectTrigger className="rounded-[30px] border-red-300 focus:border-red-500">
                    <SelectValue placeholder="Select manager (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Manager</SelectItem>
                    {managers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-red-700">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter department description"
                className="rounded-[20px] border-red-300 focus:border-red-500 focus:ring-red-500"
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-[30px] hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-600/25"
              >
                {editingDept ? (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update Department
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Department
                  </>
                )}
              </Button>
              {editingDept && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="rounded-[30px] border-red-300 text-red-700 hover:bg-red-50"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-red-600/20 shadow-lg bg-gradient-to-br from-white/95 to-red-50/30">
        <CardHeader className="bg-gradient-to-r from-red-600/10 to-red-500/10 rounded-t-3xl border-b border-red-600/20">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Building className="h-5 w-5" />
            Departments
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader className="bg-red-50/50">
              <TableRow>
                <TableHead className="text-red-700 font-semibold">Name</TableHead>
                <TableHead className="text-red-700 font-semibold">Description</TableHead>
                <TableHead className="text-red-700 font-semibold">Manager</TableHead>
                <TableHead className="text-red-700 font-semibold">Employees</TableHead>
                <TableHead className="text-right text-red-700 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No departments found. Create your first department above.
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((dept) => (
                  <TableRow key={dept.id} className="hover:bg-red-50/30">
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{dept.description || "No description"}</TableCell>
                    <TableCell>
                      {dept.manager?.full_name || "Unassigned"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit border-red-300 text-red-700">
                        <Users className="h-3 w-3" />
                        {dept.employee_count || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-red-100 text-red-600"
                          onClick={() => handleEdit(dept)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-red-100 text-red-600"
                          onClick={() => handleDelete(dept.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
