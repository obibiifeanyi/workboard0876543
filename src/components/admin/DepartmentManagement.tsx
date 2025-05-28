
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Department {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export const DepartmentManagement = () => {
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Department[];
    },
  });

  const createDepartment = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('departments')
        .insert([{ name }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setNewDepartmentName("");
      toast({
        title: "Success",
        description: "Department created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateDepartment = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data, error } = await supabase
        .from('departments')
        .update({ name })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setEditingDepartment(null);
      toast({
        title: "Success",
        description: "Department updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteDepartment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateDepartment = () => {
    if (newDepartmentName.trim()) {
      createDepartment.mutate(newDepartmentName.trim());
    }
  };

  const handleUpdateDepartment = (name: string) => {
    if (editingDepartment && name.trim()) {
      updateDepartment.mutate({ id: editingDepartment.id, name: name.trim() });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Department Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Department name"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateDepartment()}
            />
            <Button onClick={handleCreateDepartment} disabled={createDepartment.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <p>Loading departments...</p>
            ) : departments && departments.length > 0 ? (
              departments.map((department) => (
                <div key={department.id} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingDepartment?.id === department.id ? (
                    <div className="flex gap-2 flex-1">
                      <Input
                        defaultValue={department.name}
                        onBlur={(e) => handleUpdateDepartment(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateDepartment((e.target as HTMLInputElement).value);
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingDepartment(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{department.name}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingDepartment(department)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteDepartment.mutate(department.id)}
                          disabled={deleteDepartment.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No departments found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
