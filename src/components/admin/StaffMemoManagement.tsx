
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Plus, Send, Eye, Loader } from "lucide-react";

export const StaffMemoManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    recipient_id: "",
    memo_type: "general",
    priority: "medium",
  });

  // Get all users for recipient selection
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get staff memos
  const { data: memos, isLoading: isLoadingMemos } = useQuery({
    queryKey: ['staffMemos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_memos')
        .select(`
          *,
          sender:profiles!staff_memos_sender_id_fkey(full_name, email),
          recipient:profiles!staff_memos_recipient_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Create memo mutation
  const createMemo = useMutation({
    mutationFn: async (memoData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('staff_memos')
        .insert({
          ...memoData,
          sender_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffMemos'] });
      toast({
        title: "Success",
        description: "Memo sent successfully",
      });
      setFormData({
        subject: "",
        content: "",
        recipient_id: "",
        memo_type: "general",
        priority: "medium",
      });
      setIsCreateOpen(false);
    },
    onError: (error) => {
      console.error('Error sending memo:', error);
      toast({
        title: "Error",
        description: "Failed to send memo",
        variant: "destructive",
      });
    },
  });

  const handleSendMemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipient_id || !formData.subject || !formData.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    await createMemo.mutateAsync(formData);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoadingUsers || isLoadingMemos) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-6 w-6 text-red-600" />
          <h1 className="text-2xl font-bold">Staff Memo Management</h1>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-red-600 to-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Send Memo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send New Memo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSendMemo} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipient">Recipient</Label>
                  <Select
                    value={formData.recipient_id}
                    onValueChange={(value) => setFormData({ ...formData, recipient_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="memo_type">Memo Type</Label>
                  <Select
                    value={formData.memo_type}
                    onValueChange={(value) => setFormData({ ...formData, memo_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="policy">Policy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMemo.isPending}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Memo
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Memos Table */}
      <Card className="rounded-3xl border-red-600/20">
        <CardHeader>
          <CardTitle>Staff Memos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memos?.map((memo) => (
                <TableRow key={memo.id}>
                  <TableCell className="font-medium">{memo.subject}</TableCell>
                  <TableCell>{memo.sender?.full_name || 'Unknown'}</TableCell>
                  <TableCell>{memo.recipient?.full_name || 'Unknown'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{memo.memo_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(memo.priority || 'medium')}>
                      {memo.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(memo.status || 'sent')}>
                      {memo.is_read ? 'Read' : memo.status || 'Sent'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(memo.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {memos?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No memos found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
