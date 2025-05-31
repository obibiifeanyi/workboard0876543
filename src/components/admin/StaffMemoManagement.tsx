
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, MessageSquare, CheckCircle, Clock, AlertCircle, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const AdminStaffMemoManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMemo, setSelectedMemo] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const { data: staffMemos, isLoading } = useQuery({
    queryKey: ['admin_staff_memos', statusFilter, priorityFilter],
    queryFn: async () => {
      let query = supabase
        .from('staff_memos')
        .select(`
          *,
          sender:profiles!staff_memos_sender_id_fkey(full_name, email, department),
          recipient:profiles!staff_memos_recipient_id_fkey(full_name, email, department)
        `);

      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }
      
      if (priorityFilter !== "all") {
        query = query.eq('priority', priorityFilter);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateMemoStatusMutation = useMutation({
    mutationFn: async ({ memoId, status }: { memoId: string; status: string }) => {
      const { error } = await supabase
        .from('staff_memos')
        .update({ status })
        .eq('id', memoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_staff_memos'] });
      toast({
        title: "Success",
        description: "Memo status updated successfully",
      });
    },
  });

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-blue-100 text-blue-800 border-blue-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      urgent: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge className={`${colors[priority as keyof typeof colors]} border`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      sent: 'bg-blue-100 text-blue-800 border-blue-200',
      read: 'bg-green-100 text-green-800 border-green-200',
      archived: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    
    return (
      <Badge className={`${colors[status as keyof typeof colors]} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const memoStats = {
    total: staffMemos?.length || 0,
    unread: staffMemos?.filter(memo => !memo.is_read).length || 0,
    urgent: staffMemos?.filter(memo => memo.priority === 'urgent').length || 0,
    thisWeek: staffMemos?.filter(memo => {
      const memoDate = new Date(memo.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return memoDate > weekAgo;
    }).length || 0
  };

  if (isLoading) {
    return (
      <Card className="enhanced-card">
        <CardContent className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="enhanced-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 font-unica text-xl">
            <MessageSquare className="h-6 w-6 text-primary" />
            Staff Memos Administration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Memos</p>
                  <p className="text-2xl font-bold text-blue-800">{memoStats.total}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-orange-600 font-medium">Unread</p>
                  <p className="text-2xl font-bold text-orange-800">{memoStats.unread}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-red-600 font-medium">Urgent</p>
                  <p className="text-2xl font-bold text-red-800">{memoStats.urgent}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">This Week</p>
                  <p className="text-2xl font-bold text-green-800">{memoStats.thisWeek}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Memos Table */}
          {!staffMemos?.length ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No staff memos found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">From</TableHead>
                    <TableHead className="font-semibold">To</TableHead>
                    <TableHead className="font-semibold">Subject</TableHead>
                    <TableHead className="font-semibold">Priority</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMemos.map((memo) => (
                    <TableRow key={memo.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>{getStatusBadge(memo.status)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{memo.sender?.full_name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{memo.sender?.department}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{memo.recipient?.full_name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{memo.recipient?.department}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{memo.subject}</p>
                          <p className="text-sm text-muted-foreground truncate">{memo.content}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(memo.priority)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{format(new Date(memo.created_at), 'MMM dd, yyyy')}</p>
                          <p className="text-muted-foreground">{format(new Date(memo.created_at), 'HH:mm')}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMemo(selectedMemo === memo.id ? null : memo.id)}
                            className="h-8 px-3 text-xs"
                          >
                            {selectedMemo === memo.id ? 'Hide' : 'View'}
                          </Button>
                          <Select
                            value={memo.status}
                            onValueChange={(status) => updateMemoStatusMutation.mutate({ memoId: memo.id, status })}
                          >
                            <SelectTrigger className="w-20 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sent">Sent</SelectItem>
                              <SelectItem value="read">Read</SelectItem>
                              <SelectItem value="archived">Archive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Selected Memo Details */}
          {selectedMemo && (
            <Card className="mt-6 border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                {(() => {
                  const memo = staffMemos?.find(m => m.id === selectedMemo);
                  if (!memo) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg">{memo.subject}</h4>
                        <div className="flex gap-2">
                          {getPriorityBadge(memo.priority)}
                          {getStatusBadge(memo.status)}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">From:</span> {memo.sender?.full_name} ({memo.sender?.department})
                        </div>
                        <div>
                          <span className="font-medium">To:</span> {memo.recipient?.full_name} ({memo.recipient?.department})
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {format(new Date(memo.created_at), 'PPpp')}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {memo.memo_type}
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <h5 className="font-medium mb-2">Content:</h5>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{memo.content}</p>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
