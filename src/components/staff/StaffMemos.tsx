
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Eye, Send } from "lucide-react";
import { useStaffOperations } from "@/hooks/useStaffOperations";
import { useSystemData } from "@/hooks/useSystemData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

export const StaffMemos = () => {
  const { useStaffMemos, createStaffMemo, markMemoAsRead } = useStaffOperations();
  const { useProfiles } = useSystemData();
  const { data: memos = [], isLoading } = useStaffMemos();
  const { data: profiles = [] } = useProfiles();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState<any>(null);
  const [newMemo, setNewMemo] = useState({
    recipient_id: '',
    subject: '',
    content: '',
    memo_type: 'general',
    priority: 'medium',
  });

  const handleCreateMemo = () => {
    if (!newMemo.recipient_id || !newMemo.subject || !newMemo.content) {
      return;
    }

    createStaffMemo.mutate(newMemo, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewMemo({
          recipient_id: '',
          subject: '',
          content: '',
          memo_type: 'general',
          priority: 'medium',
        });
      },
    });
  };

  const handleViewMemo = (memo: any) => {
    setSelectedMemo(memo);
    if (!memo.is_read && memo.recipient_id) {
      markMemoAsRead.mutate(memo.id);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'announcement': return 'bg-blue-100 text-blue-800';
      case 'policy': return 'bg-purple-100 text-purple-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Loading memos...</div>;
  }

  return (
    <>
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <MessageSquare className="h-5 w-5 text-primary" />
              Staff Memos
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Send Memo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Send New Memo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient *</Label>
                    <Select value={newMemo.recipient_id} onValueChange={(value) => setNewMemo({ ...newMemo, recipient_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.full_name} ({profile.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select value={newMemo.memo_type} onValueChange={(value) => setNewMemo({ ...newMemo, memo_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="policy">Policy</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newMemo.priority} onValueChange={(value) => setNewMemo({ ...newMemo, priority: value })}>
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

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={newMemo.subject}
                      onChange={(e) => setNewMemo({ ...newMemo, subject: e.target.value })}
                      placeholder="Memo subject"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={newMemo.content}
                      onChange={(e) => setNewMemo({ ...newMemo, content: e.target.value })}
                      placeholder="Memo content..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <Button 
                    onClick={handleCreateMemo} 
                    className="w-full" 
                    disabled={createStaffMemo.isPending}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {createStaffMemo.isPending ? "Sending..." : "Send Memo"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {memos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No memos yet. Send your first memo to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {memos.map((memo) => (
                <Card 
                  key={memo.id} 
                  className={`glass-card cursor-pointer hover:shadow-md transition-shadow ${
                    !memo.is_read && memo.recipient_id ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => handleViewMemo(memo)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{memo.subject}</h4>
                            {!memo.is_read && memo.recipient_id && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {memo.sender ? `From: ${memo.sender.full_name}` : `To: ${memo.recipient?.full_name}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(memo.created_at), 'MMM dd, yyyy - HH:mm')}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(memo.priority)}>
                            {memo.priority}
                          </Badge>
                          <Badge className={getTypeColor(memo.memo_type)}>
                            {memo.memo_type}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm line-clamp-2">{memo.content}</p>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-xs text-muted-foreground">
                          Status: {memo.status}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Memo Detail Dialog */}
      <Dialog open={!!selectedMemo} onOpenChange={() => setSelectedMemo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMemo?.subject}</DialogTitle>
          </DialogHeader>
          {selectedMemo && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {selectedMemo.sender ? `From: ${selectedMemo.sender.full_name}` : `To: ${selectedMemo.recipient?.full_name}`}
                </div>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(selectedMemo.priority)}>
                    {selectedMemo.priority}
                  </Badge>
                  <Badge className={getTypeColor(selectedMemo.memo_type)}>
                    {selectedMemo.memo_type}
                  </Badge>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {format(new Date(selectedMemo.created_at), 'MMMM dd, yyyy - HH:mm')}
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="whitespace-pre-wrap">{selectedMemo.content}</p>
              </div>

              {selectedMemo.read_at && (
                <div className="text-xs text-muted-foreground">
                  Read on: {format(new Date(selectedMemo.read_at), 'MMM dd, yyyy - HH:mm')}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
