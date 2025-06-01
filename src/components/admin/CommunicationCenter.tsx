
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Send, Users, MessageSquare, Loader, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Memo {
  id: string;
  title: string;
  content: string;
  department: string | null;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface StaffMemo {
  id: string;
  subject: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  memo_type: string;
  priority: string;
  is_read: boolean;
  status: string;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department: string;
}

export const CommunicationCenter = () => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [staffMemos, setStaffMemos] = useState<StaffMemo[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("memos");
  const { toast } = useToast();

  const [memoForm, setMemoForm] = useState({
    title: "",
    content: "",
    department: "",
  });

  const [staffMemoForm, setStaffMemoForm] = useState({
    subject: "",
    content: "",
    recipient_id: "",
    memo_type: "general",
    priority: "medium",
  });

  useEffect(() => {
    fetchMemos();
    fetchStaffMemos();
    fetchUsers();
  }, []);

  const fetchMemos = async () => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemos(data || []);
    } catch (error) {
      console.error('Error fetching memos:', error);
    }
  };

  const fetchStaffMemos = async () => {
    try {
      const { data, error } = await supabase
        .from('staff_memos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStaffMemos(data || []);
    } catch (error) {
      console.error('Error fetching staff memos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, department')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleMemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('memos')
        .insert({
          title: memoForm.title,
          content: memoForm.content,
          department: memoForm.department || null,
          created_by: user.id,
          status: 'published'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Memo published successfully",
      });

      setMemoForm({ title: "", content: "", department: "" });
      fetchMemos();
    } catch (error: any) {
      console.error('Error creating memo:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create memo",
        variant: "destructive",
      });
    }
  };

  const handleStaffMemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('staff_memos')
        .insert({
          subject: staffMemoForm.subject,
          content: staffMemoForm.content,
          sender_id: user.id,
          recipient_id: staffMemoForm.recipient_id,
          memo_type: staffMemoForm.memo_type,
          priority: staffMemoForm.priority,
          status: 'sent'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message sent successfully",
      });

      setStaffMemoForm({
        subject: "",
        content: "",
        recipient_id: "",
        memo_type: "general",
        priority: "medium",
      });
      fetchStaffMemos();
    } catch (error: any) {
      console.error('Error sending staff memo:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "secondary",
      medium: "default",
      high: "destructive",
    } as const;

    return (
      <Badge variant={variants[priority as keyof typeof variants] || "default"}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.full_name || 'Unknown User';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <Loader className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-6 w-6 text-red-600" />
        <h1 className="text-2xl font-bold">Communication Center</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="memos">Company Memos</TabsTrigger>
          <TabsTrigger value="messages">Staff Messages</TabsTrigger>
          <TabsTrigger value="create-memo">Create Memo</TabsTrigger>
          <TabsTrigger value="send-message">Send Message</TabsTrigger>
        </TabsList>

        <TabsContent value="memos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Company Memos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memos.map((memo) => (
                  <Card key={memo.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{memo.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {memo.department ? `Department: ${memo.department}` : 'All Departments'}
                          </p>
                        </div>
                        <Badge variant="secondary">{memo.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{memo.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Created: {new Date(memo.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
                {memos.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No memos found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Staff Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffMemos.map((memo) => (
                  <Card key={memo.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{memo.subject}</h3>
                          <p className="text-sm text-muted-foreground">
                            From: {getUserName(memo.sender_id)} → To: {getUserName(memo.recipient_id)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {getPriorityBadge(memo.priority)}
                          {memo.is_read ? (
                            <Badge variant="outline">Read</Badge>
                          ) : (
                            <Badge variant="default">Unread</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{memo.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Sent: {new Date(memo.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
                {staffMemos.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No messages found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create-memo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Company Memo</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMemoSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="memo-title">Title</Label>
                  <Input
                    id="memo-title"
                    value={memoForm.title}
                    onChange={(e) => setMemoForm({ ...memoForm, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="memo-department">Department (Optional)</Label>
                  <Input
                    id="memo-department"
                    value={memoForm.department}
                    onChange={(e) => setMemoForm({ ...memoForm, department: e.target.value })}
                    placeholder="Leave empty for all departments"
                  />
                </div>
                <div>
                  <Label htmlFor="memo-content">Content</Label>
                  <Textarea
                    id="memo-content"
                    value={memoForm.content}
                    onChange={(e) => setMemoForm({ ...memoForm, content: e.target.value })}
                    rows={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Publish Memo
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="send-message" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Staff Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStaffMemoSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="message-recipient">Recipient</Label>
                  <Select
                    value={staffMemoForm.recipient_id}
                    onValueChange={(value) => setStaffMemoForm({ ...staffMemoForm, recipient_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name} ({user.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="message-type">Type</Label>
                    <Select
                      value={staffMemoForm.memo_type}
                      onValueChange={(value) => setStaffMemoForm({ ...staffMemoForm, memo_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message-priority">Priority</Label>
                    <Select
                      value={staffMemoForm.priority}
                      onValueChange={(value) => setStaffMemoForm({ ...staffMemoForm, priority: value })}
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
                <div>
                  <Label htmlFor="message-subject">Subject</Label>
                  <Input
                    id="message-subject"
                    value={staffMemoForm.subject}
                    onChange={(e) => setStaffMemoForm({ ...staffMemoForm, subject: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message-content">Message</Label>
                  <Textarea
                    id="message-content"
                    value={staffMemoForm.content}
                    onChange={(e) => setStaffMemoForm({ ...staffMemoForm, content: e.target.value })}
                    rows={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
