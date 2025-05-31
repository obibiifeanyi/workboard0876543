
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const StaffMemoManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMemo, setSelectedMemo] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState("");

  const { data: staffMemos, isLoading } = useQuery({
    queryKey: ['staff_memos'],
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
      return data;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (memoId: string) => {
      const { error } = await supabase
        .from('staff_memos')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', memoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff_memos'] });
      toast({
        title: "Success",
        description: "Memo marked as read",
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

  const getStatusIcon = (isRead: boolean) => {
    return isRead ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-orange-500" />
    );
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
            Staff Memos Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Memos</p>
                  <p className="text-2xl font-bold text-blue-800">{staffMemos?.length || 0}</p>
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
                  <p className="text-2xl font-bold text-orange-800">
                    {staffMemos?.filter(memo => !memo.is_read).length || 0}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Read</p>
                  <p className="text-2xl font-bold text-green-800">
                    {staffMemos?.filter(memo => memo.is_read).length || 0}
                  </p>
                </div>
              </div>
            </Card>
          </div>

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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(memo.is_read)}
                          <span className="text-sm">
                            {memo.is_read ? 'Read' : 'Unread'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{memo.sender?.full_name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{memo.sender?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{memo.recipient?.full_name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{memo.recipient?.email}</p>
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
                          {!memo.is_read && (
                            <Button
                              size="sm"
                              onClick={() => markAsReadMutation.mutate(memo.id)}
                              disabled={markAsReadMutation.isPending}
                              className="h-8 px-3 text-xs"
                            >
                              Mark Read
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMemo(selectedMemo === memo.id ? null : memo.id)}
                            className="h-8 px-3 text-xs"
                          >
                            {selectedMemo === memo.id ? 'Hide' : 'View'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

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
                        {getPriorityBadge(memo.priority)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">From:</span> {memo.sender?.full_name} ({memo.sender?.email})
                        </div>
                        <div>
                          <span className="font-medium">To:</span> {memo.recipient?.full_name} ({memo.recipient?.email})
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
