
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, FileText, Users } from "lucide-react";
import { UserSelector } from "./UserSelector";

interface EnhancedMemoFormProps {
  onMemoSent?: () => void;
  type?: 'individual' | 'department';
}

export const EnhancedMemoForm = ({ onMemoSent, type = 'individual' }: EnhancedMemoFormProps) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState("normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and content",
        variant: "destructive",
      });
      return;
    }

    if (type === 'individual' && !recipientId) {
      toast({
        title: "Missing Recipient",
        description: "Please select a recipient",
        variant: "destructive",
      });
      return;
    }

    if (type === 'department' && !department) {
      toast({
        title: "Missing Department",
        description: "Please select a department",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to send a memo",
          variant: "destructive",
        });
        return;
      }

      if (type === 'individual') {
        // Send individual memo
        const { error } = await supabase
          .from('user_memos')
          .insert({
            subject: subject.trim(),
            content: content.trim(),
            sender_id: user.id,
            recipient_id: recipientId,
            is_read: false,
          });

        if (error) throw error;
      } else {
        // Send department memo
        const { error } = await supabase
          .from('memos')
          .insert({
            title: subject.trim(),
            content: content.trim(),
            department: department,
            status: 'published',
            created_by: user.id,
          });

        if (error) throw error;
      }

      toast({
        title: "Memo Sent Successfully",
        description: `Your ${type} memo has been sent successfully`,
      });

      // Reset form
      setSubject("");
      setContent("");
      setRecipientId("");
      setDepartment("");
      setPriority("normal");

      if (onMemoSent) {
        onMemoSent();
      }

    } catch (error) {
      console.error('Error sending memo:', error);
      toast({
        title: "Error",
        description: "Failed to send memo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          {type === 'individual' ? 'Send Individual Memo' : 'Send Department Memo'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter memo subject..."
              className="bg-white/5 border-white/10 rounded-[30px]"
              required
            />
          </div>

          {type === 'individual' ? (
            <div className="space-y-2">
              <Label>Recipient *</Label>
              <UserSelector
                selectedUserId={recipientId}
                onUserSelect={setRecipientId}
                includeAdmins={true}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="bg-white/5 border-white/10 rounded-[30px]">
                  <SelectValue placeholder="Select department..." />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-black/95 backdrop-blur-lg">
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="admin">Administration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="bg-white/5 border-white/10 rounded-[30px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-black/95 backdrop-blur-lg">
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="normal">Normal Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your memo content here..."
              rows={6}
              className="bg-white/5 border-white/10 rounded-[30px]"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !subject.trim() || !content.trim() || (type === 'individual' && !recipientId) || (type === 'department' && !department)}
            className="w-full rounded-[30px]"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Sending..." : "Send Memo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
