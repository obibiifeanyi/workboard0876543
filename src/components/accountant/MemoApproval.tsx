
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileCheck, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const MemoApproval = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMemo, setSelectedMemo] = useState<string | null>(null);
  const [approvalComments, setApprovalComments] = useState("");

  const { data: pendingMemos, isLoading } = useQuery({
    queryKey: ['pending_memos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memos')
        .select(`
          *,
          created_by:profiles!memos_created_by_fkey(full_name, email),
          memo_approvals(*)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: approvalHistory } = useQuery({
    queryKey: ['memo_approval_history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memo_approvals')
        .select(`
          *,
          memo:memos(title, created_by),
          approver:profiles!memo_approvals_approver_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  const approveMemoMutation = useMutation({
    mutationFn: async ({ memoId, action, comments }: { memoId: string; action: 'approved' | 'rejected'; comments: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create approval record
      const { error: approvalError } = await supabase
        .from('memo_approvals')
        .insert({
          memo_id: memoId,
          approver_id: user.id,
          status: action,
          approval_date: new Date().toISOString(),
          comments: comments
        });

      if (approvalError) throw approvalError;

      // Update memo status
      const { error: memoError } = await supabase
        .from('memos')
        .update({ status: action })
        .eq('id', memoId);

      if (memoError) throw memoError;
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ['pending_memos'] });
      queryClient.invalidateQueries({ queryKey: ['memo_approval_history'] });
      setSelectedMemo(null);
      setApprovalComments("");
      toast({
        title: "Success",
        description: `Memo ${action} successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process memo",
        variant: "destructive",
      });
    },
  });

  const handleApproval = (memoId: string, action: 'approved' | 'rejected') => {
    approveMemoMutation.mutate({ memoId, action, comments: approvalComments });
  };

  if (isLoading) {
    return (
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <FileCheck className="h-5 w-5 text-primary" />
            Memo Approval
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading memos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <FileCheck className="h-5 w-5 text-primary" />
          Memo Approval
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pending Memos */}
          <div>
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Approvals ({pendingMemos?.length || 0})
            </h3>
            {!pendingMemos?.length ? (
              <div className="text-center text-muted-foreground py-8">
                No memos pending approval.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingMemos.map((memo) => (
                  <Card key={memo.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{memo.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            From: {memo.created_by?.full_name || 'Unknown'} • {format(new Date(memo.created_at), 'PPP')}
                          </p>
                          <p className="text-sm mt-2">{memo.content}</p>
                        </div>
                        <Badge variant="outline" className="ml-4">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                      
                      {selectedMemo === memo.id && (
                        <div className="space-y-3 pt-4 border-t">
                          <Textarea
                            placeholder="Add approval comments (optional)"
                            value={approvalComments}
                            onChange={(e) => setApprovalComments(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApproval(memo.id, 'approved')}
                              disabled={approveMemoMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleApproval(memo.id, 'rejected')}
                              disabled={approveMemoMutation.isPending}
                              variant="destructive"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                            <Button
                              onClick={() => setSelectedMemo(null)}
                              variant="outline"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {selectedMemo !== memo.id && (
                        <Button
                          onClick={() => setSelectedMemo(memo.id)}
                          variant="outline"
                          size="sm"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Review & Approve
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recent Approval History */}
          <div>
            <h3 className="font-medium mb-4">Recent Approval History</h3>
            {!approvalHistory?.length ? (
              <div className="text-center text-muted-foreground py-4">
                No approval history found.
              </div>
            ) : (
              <div className="space-y-2">
                {approvalHistory.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      {approval.status === 'approved' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{approval.memo?.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {approval.approver?.full_name} • {format(new Date(approval.approval_date || approval.created_at), 'PP')}
                        </p>
                      </div>
                    </div>
                    <Badge variant={approval.status === 'approved' ? 'default' : 'destructive'}>
                      {approval.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
