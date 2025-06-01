
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Search, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

interface Memo {
  id: string;
  subject: string;
  content: string;
  sender: { full_name: string };
  recipient: { full_name: string };
  priority: 'low' | 'medium' | 'high';
  status: 'sent' | 'read' | 'draft';
  memo_type: 'general' | 'urgent' | 'announcement' | 'reminder';
  created_at: string;
  read_at?: string;
  is_read: boolean;
}

export const StaffMemos = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newMemo, setNewMemo] = useState({
    subject: '',
    content: '',
    recipient_id: '',
    priority: 'medium' as const,
    memo_type: 'general' as const
  });

  // Mock memos data
  const memos: Memo[] = [
    {
      id: '1',
      subject: 'Monthly Team Meeting',
      content: 'Please attend the monthly team meeting scheduled for next Friday at 2 PM in Conference Room A. We will discuss project updates and upcoming deadlines.',
      sender: { full_name: 'John Manager' },
      recipient: { full_name: 'Current User' },
      priority: 'medium',
      status: 'read',
      memo_type: 'announcement',
      created_at: '2024-01-15T10:00:00Z',
      read_at: '2024-01-15T14:30:00Z',
      is_read: true
    },
    {
      id: '2',
      subject: 'Equipment Maintenance Reminder',
      content: 'This is a reminder that all battery testing equipment needs to be calibrated by the end of this week. Please coordinate with the maintenance team.',
      sender: { full_name: 'Sarah Lead' },
      recipient: { full_name: 'Current User' },
      priority: 'high',
      status: 'sent',
      memo_type: 'reminder',
      created_at: '2024-01-14T09:15:00Z',
      is_read: false
    },
    {
      id: '3',
      subject: 'New Safety Protocols',
      content: 'New safety protocols have been implemented for site visits. Please review the updated guidelines in the safety manual before your next field assignment.',
      sender: { full_name: 'Mike Safety' },
      recipient: { full_name: 'Current User' },
      priority: 'high',
      status: 'sent',
      memo_type: 'urgent',
      created_at: '2024-01-13T16:45:00Z',
      is_read: false
    },
    {
      id: '4',
      subject: 'Training Session Completion',
      content: 'Congratulations on completing the advanced battery diagnostics training. Your certificate will be available for download from the training portal.',
      sender: { full_name: 'Lisa HR' },
      recipient: { full_name: 'Current User' },
      priority: 'low',
      status: 'read',
      memo_type: 'general',
      created_at: '2024-01-12T11:20:00Z',
      read_at: '2024-01-12T15:10:00Z',
      is_read: true
    }
  ];

  const filteredMemos = memos.filter(memo =>
    memo.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memo.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memo.sender.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMemo = () => {
    if (!newMemo.subject || !newMemo.content || !newMemo.recipient_id) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Mock memo sending
    toast({
      title: "Success",
      description: "Memo sent successfully",
    });

    setIsCreateDialogOpen(false);
    setNewMemo({
      subject: '',
      content: '',
      recipient_id: '',
      priority: 'medium',
      memo_type: 'general'
    });
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
      case 'reminder': return 'bg-orange-100 text-orange-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
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
                New Memo
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
                      <SelectItem value="manager1">John Manager</SelectItem>
                      <SelectItem value="lead1">Sarah Lead</SelectItem>
                      <SelectItem value="tech1">Mike Technician</SelectItem>
                      <SelectItem value="hr1">Lisa HR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newMemo.priority} onValueChange={(value: any) => setNewMemo({ ...newMemo, priority: value })}>
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

                  <div className="space-y-2">
                    <Label htmlFor="type">Memo Type</Label>
                    <Select value={newMemo.memo_type} onValueChange={(value: any) => setNewMemo({ ...newMemo, memo_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
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
                    placeholder="Enter memo subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Message *</Label>
                  <Textarea
                    id="content"
                    value={newMemo.content}
                    onChange={(e) => setNewMemo({ ...newMemo, content: e.target.value })}
                    placeholder="Enter memo content"
                    className="min-h-[120px]"
                  />
                </div>

                <Button onClick={handleSendMemo} className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Memo
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search memos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredMemos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No memos found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMemos.map((memo) => (
              <Card key={memo.id} className={`glass-card ${!memo.is_read ? 'border-primary border-l-4' : ''}`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className={`font-medium ${!memo.is_read ? 'font-bold' : ''}`}>
                          {memo.subject}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          From: {memo.sender.full_name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(memo.priority)}>
                          {memo.priority}
                        </Badge>
                        <Badge className={getTypeColor(memo.memo_type)}>
                          {memo.memo_type}
                        </Badge>
                        {!memo.is_read && (
                          <Badge variant="secondary">New</Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm">{memo.content}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Sent: {format(new Date(memo.created_at), 'MMM dd, yyyy HH:mm')}
                      </span>
                      {memo.read_at && (
                        <span>
                          Read: {format(new Date(memo.read_at), 'MMM dd, yyyy HH:mm')}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
