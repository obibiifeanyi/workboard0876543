
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemoApprovalSystem } from "@/hooks/useMemoApprovalSystem";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Edit, Trash2, Send, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

export const UserMemoManagement = () => {
  const { toast } = useToast();
  const {
    userMemos,
    isLoadingUserMemos,
    createMemo,
    updateMemo,
    deleteMemo,
  } = useMemoApprovalSystem();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMemo, setEditingMemo] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    department: '',
    status: 'draft' as 'draft' | 'pending'
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      department: '',
      status: 'draft'
    });
    setEditingMemo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Validate form fields
    if (!formData.title.trim() || !formData.content.trim()) {
      setErrorMessage('Please fill in all required fields');
      setIsSubmitting(false);
      toast({
        title: 'Validation Error',
        description: 'Please fill in title and content fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingMemo) {
        await updateMemo.mutateAsync({
          id: editingMemo.id,
          data: formData
        });
      } else {
        await createMemo.mutateAsync(formData);
      }
      
      setIsSuccess(true);
      setIsSubmitting(false);
      toast({
        title: 'Success',
        description: editingMemo ? 'Memo updated successfully.' : 'Memo created successfully.',
      });
      setIsCreateDialogOpen(false);
      resetForm();
      
      // Reset success state after a delay
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error: any) {
      setIsSubmitting(false);
      setErrorMessage(error?.message || 'Error saving memo');
      console.error('Error saving memo:', error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to save memo.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (memo: any) => {
    setEditingMemo(memo);
    setFormData({
      title: memo.title,
      content: memo.content,
      department: memo.department || '',
      status: memo.status
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (memoId: string) => {
    if (window.confirm('Are you sure you want to delete this memo?')) {
      await deleteMemo.mutateAsync(memoId);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, icon: FileText, label: 'Draft' },
      pending: { variant: 'outline' as const, icon: Clock, label: 'Pending Approval' },
      approved: { variant: 'default' as const, icon: CheckCircle, label: 'Approved' },
      rejected: { variant: 'destructive' as const, icon: XCircle, label: 'Rejected' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (isLoadingUserMemos) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="enhanced-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            My Memos
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Memo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingMemo ? 'Edit Memo' : 'Create New Memo'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter memo title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="department">Department (Optional)</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="telecom">Telecom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter memo content"
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'draft' | 'pending' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Save as Draft</SelectItem>
                      <SelectItem value="pending">Submit for Approval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Memo'}
                  </Button>
                  {errorMessage && (
                    <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
                  )}
                  {isSuccess && (
                    <p className="text-green-600 text-xs mt-2">Memo saved successfully!</p>
                  )}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({userMemos?.length || 0})</TabsTrigger>
            <TabsTrigger value="draft">
              Drafts ({userMemos?.filter(m => m.status === 'draft').length || 0})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({userMemos?.filter(m => m.status === 'pending').length || 0})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({userMemos?.filter(m => m.status === 'approved').length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <MemoTable 
              memos={userMemos || []} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>

          <TabsContent value="draft" className="mt-6">
            <MemoTable 
              memos={userMemos?.filter(m => m.status === 'draft') || []} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <MemoTable 
              memos={userMemos?.filter(m => m.status === 'pending') || []} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            <MemoTable 
              memos={userMemos?.filter(m => m.status === 'approved') || []} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface MemoTableProps {
  memos: any[];
  onEdit: (memo: any) => void;
  onDelete: (memoId: string) => void;
  getStatusBadge: (status: string) => JSX.Element;
}

const MemoTable = ({ memos, onEdit, onDelete, getStatusBadge }: MemoTableProps) => {
  if (!memos.length) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No memos found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memos.map((memo) => (
            <TableRow key={memo.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{memo.title}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-xs">
                    {memo.content}
                  </p>
                </div>
              </TableCell>
              <TableCell>{memo.department || 'All'}</TableCell>
              <TableCell>{getStatusBadge(memo.status)}</TableCell>
              <TableCell>{format(new Date(memo.created_at), 'MMM dd, yyyy')}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(memo)}
                    disabled={memo.status === 'approved'}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(memo.id)}
                    disabled={memo.status === 'approved'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
