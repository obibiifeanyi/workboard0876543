import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Trash2, Edit, DragHandle } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  order: number;
  form_id: string;
}

interface Form {
  id: string;
  title: string;
  description: string;
  department_id: string;
  created_at: string;
  created_by: string;
  is_active: boolean;
  fields: FormField[];
}

export const FormBuilder = () => {
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department_id: "",
    is_active: true,
  });
  const [fieldData, setFieldData] = useState({
    label: "",
    type: "text",
    required: false,
    options: [] as string[],
  });

  // Fetch forms with their fields
  const { data: forms, isLoading } = useQuery({
    queryKey: ['forms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forms')
        .select(`
          *,
          fields:form_fields(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Form[];
    },
  });

  // Fetch departments for dropdown
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Create form mutation
  const createForm = useMutation({
    mutationFn: async (formData: typeof formData) => {
      const { data, error } = await supabase
        .from('forms')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      toast({
        title: "Success",
        description: "Form created successfully",
      });
      setIsCreateOpen(false);
      setFormData({
        title: "",
        description: "",
        department_id: "",
        is_active: true,
      });
    },
    onError: (error) => handleError(error),
  });

  // Add field mutation
  const addField = useMutation({
    mutationFn: async ({ formId, field }: { formId: string; field: Omit<FormField, 'id' | 'form_id' | 'order'> }) => {
      // Get the highest order number
      const { data: existingFields } = await supabase
        .from('form_fields')
        .select('order')
        .eq('form_id', formId)
        .order('order', { ascending: false })
        .limit(1);

      const order = existingFields?.[0]?.order ?? 0;

      const { data, error } = await supabase
        .from('form_fields')
        .insert([{
          ...field,
          form_id: formId,
          order: order + 1,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      toast({
        title: "Success",
        description: "Field added successfully",
      });
      setFieldData({
        label: "",
        type: "text",
        required: false,
        options: [],
      });
    },
    onError: (error) => handleError(error),
  });

  // Update field order mutation
  const updateFieldOrder = useMutation({
    mutationFn: async ({ formId, fields }: { formId: string; fields: FormField[] }) => {
      const updates = fields.map((field, index) => ({
        id: field.id,
        order: index + 1,
      }));

      const { error } = await supabase
        .from('form_fields')
        .upsert(updates);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      toast({
        title: "Success",
        description: "Field order updated successfully",
      });
    },
    onError: (error) => handleError(error),
  });

  // Delete field mutation
  const deleteField = useMutation({
    mutationFn: async (fieldId: string) => {
      const { error } = await supabase
        .from('form_fields')
        .delete()
        .eq('id', fieldId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      toast({
        title: "Success",
        description: "Field deleted successfully",
      });
    },
    onError: (error) => handleError(error),
  });

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    await createForm.mutateAsync(formData);
  };

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForm) return;
    await addField.mutateAsync({
      formId: selectedForm.id,
      field: fieldData,
    });
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !selectedForm) return;

    const fields = Array.from(selectedForm.fields);
    const [reorderedField] = fields.splice(result.source.index, 1);
    fields.splice(result.destination.index, 0, reorderedField);

    await updateFieldOrder.mutateAsync({
      formId: selectedForm.id,
      fields,
    });
  };

  const handleDeleteField = async (fieldId: string) => {
    if (window.confirm("Are you sure you want to delete this field?")) {
      await deleteField.mutateAsync(fieldId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Form Builder</CardTitle>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Create Form</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Form</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateForm} className="space-y-4">
                <div>
                  <Label htmlFor="title">Form Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department_id}
                    onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createForm.isPending}>
                    {createForm.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Form"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Fields</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms?.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">{form.title}</TableCell>
                  <TableCell>
                    {departments?.find(d => d.id === form.department_id)?.name}
                  </TableCell>
                  <TableCell>{form.fields.length}</TableCell>
                  <TableCell>
                    {form.is_active ? (
                      <span className="text-green-500">Active</span>
                    ) : (
                      <span className="text-red-500">Inactive</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedForm(form);
                        setIsEditOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Form Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Form: {selectedForm?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <form onSubmit={handleAddField} className="space-y-4">
              <div>
                <Label htmlFor="field_label">Field Label</Label>
                <Input
                  id="field_label"
                  value={fieldData.label}
                  onChange={(e) => setFieldData({ ...fieldData, label: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="field_type">Field Type</Label>
                <Select
                  value={fieldData.type}
                  onValueChange={(value) => setFieldData({ ...fieldData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="radio">Radio</SelectItem>
                    <SelectItem value="textarea">Text Area</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={fieldData.required}
                  onChange={(e) => setFieldData({ ...fieldData, required: e.target.checked })}
                />
                <Label htmlFor="required">Required</Label>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={addField.isPending}>
                  {addField.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Field"
                  )}
                </Button>
              </div>
            </form>

            <div>
              <h3 className="text-lg font-medium mb-4">Form Fields</h3>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="fields">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {selectedForm?.fields.map((field, index) => (
                        <Draggable
                          key={field.id}
                          draggableId={field.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center gap-2 p-2 bg-muted rounded-md"
                            >
                              <div {...provided.dragHandleProps}>
                                <DragHandle className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{field.label}</div>
                                <div className="text-sm text-muted-foreground">
                                  {field.type} {field.required && "(Required)"}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteField(field.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 