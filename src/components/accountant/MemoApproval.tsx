
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileCheck, CheckCircle, XCircle, Clock, MessageSquare, Eye, FileText } from "lucide-react";
import { useMemoApprovalSystem } from "@/hooks/useMemoApprovalSystem";
import { format } from "date-fns";

export const MemoApproval = () => {
  const {
    pendingMemos,
    approvalHistory,
    isLoadingPending,
    isLoadingHistory,
    processApproval,
  } = useMemoApprovalSystem();

  const [selectedMemo, setSelectedMemo] = useState<string | null>(null);
  const [approvalComments, setApprovalComments] = useState("");
  const [viewingMemo, setViewingMemo] = useState<any>(null);

  const handleApproval = async (memoId: string, action: 'approved' | 'rejected') => {
    try {
      await processApproval.mutateAsync({ 
        memoId, 
        action, 
        comments: approvalComments 
      });
      setSelectedMemo(null);
      setApprovalComments("");
    } catch (error) {
      console.error('Error processing approval:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, icon: Clock, label: 'Pending' },
      approved: { variant: 'default' as const, icon: CheckCircle, label: 'Approved' },
      rejected: { variant: 'destructive' as const, icon: XCircle, label: 'Rejected' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (isLoadingPending) {
    return (
      <Card className="enhanced-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <FileCheck className="h-5 w-5 text-primary" />
            Memo Approval
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Pending Approval</p>
              <p className="text-2xl font-bold text-orange-800">{pendingMemos?.length || 0}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Approved Today</p>
              <p className="text-2xl font-bold text-green-800">
                {approvalHistory?.filter(h => 
                  h.status === 'approved' && 
                  new Date(h.approval_date || h.created_at).toDateString() === new Date().toDateString()
                ).length || 0}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <XCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Rejected Today</p>
              <p className="text-2xl font-bold text-red-800">
                {approvalHistory?.filter(h => 
                  h.status === 'rejected' && 
                  new Date(h.approval_date || h.created_at).toDateString() === new Date().toDateString()
                ).length || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Memos */}
      <Card className="enhanced-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Clock className="h-5 w-5 text-primary" />
            Pending Approvals ({pendingMemos?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!pendingMemos?.length ? (
            <div className="text-center text-muted-foreground py-12">
              <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p>No memos pending approval.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingMemos.map((memo) => (
                    <TableRow key={memo.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{memo.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {memo.content.substring(0, 100)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{memo.created_by_profile?.full_name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{memo.created_by_profile?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{memo.department || 'All'}</TableCell>
                      <TableCell>{format(new Date(memo.created_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setViewingMemo(memo)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Review Memo</DialogTitle>
                              </DialogHeader>
                              {viewingMemo && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">From:</span> {viewingMemo.created_by_profile?.full_name}
                                    </div>
                                    <div>
                                      <span className="font-medium">Department:</span> {viewingMemo.department || 'All'}
                                    </div>
                                    <div>
                                      <span className="font-medium">Created:</span> {format(new Date(viewingMemo.created_at), 'PPpp')}
                                    </div>
                                    <div>
                                      <span className="font-medium">Status:</span> {getStatusBadge(viewingMemo.status)}
                                    </div>
                                  </div>
                                  
                                  <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Title:</h4>
                                    <p className="text-lg font-semibold">{viewingMemo.title}</p>
                                  </div>
                                  
                                  <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Content:</h4>
                                    <div className="bg-muted/20 p-4 rounded-lg">
                                      <p className="whitespace-pre-wrap">{viewingMemo.content}</p>
                                    </div>
                                  </div>

                                  {/* Approval Section */}
                                  <div className="border-t pt-4 space-y-3">
                                    <h4 className="font-medium">Approval Decision:</h4>
                                    <Textarea
                                      placeholder="Add comments (optional)"
                                      value={selectedMemo === viewingMemo.id ? approvalComments : ''}
                                      onChange={(e) => {
                                        setSelectedMemo(viewingMemo.id);
                                        setApprovalComments(e.target.value);
                                      }}
                                      rows={3}
                                    />
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={() => handleApproval(viewingMemo.id, 'approved')}
                                        disabled={processApproval.isPending}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Approve
                                      </Button>
                                      <Button
                                        onClick={() => handleApproval(viewingMemo.id, 'rejected')}
                                        disabled={processApproval.isPending}
                                        variant="destructive"
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            onClick={() => setSelectedMemo(selectedMemo === memo.id ? null : memo.id)}
                            variant="outline"
                            size="sm"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Approval History */}
      <Card className="enhanced-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Recent Approval History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingHistory ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : !approvalHistory?.length ? (
            <div className="text-center text-muted-foreground py-8">
              No approval history found.
            </div>
          ) : (
            <div className="space-y-3">
              {approvalHistory.slice(0, 10).map((approval) => (
                <div key={approval.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    {approval.status === 'approved' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{approval.memo?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {approval.approver?.full_name} • {format(new Date(approval.approval_date || approval.created_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                      {approval.comments && (
                        <p className="text-sm text-muted-foreground italic mt-1">
                          "{approval.comments}"
                        </p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(approval.status)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
