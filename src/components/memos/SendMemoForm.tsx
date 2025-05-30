
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";

interface SendMemoFormProps {
  onMemoSent?: () => void;
}

export const SendMemoForm = ({ onMemoSent }: SendMemoFormProps) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch available recipients using proper Supabase client
  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, role')
            .neq('id', user.id)
            .order('full_name');

          if (error) {
            console.error('Error fetching recipients:', error);
          } else {
            setRecipients(data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching recipients:', error);
      }
    };

    fetchRecipients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !content.trim() || !recipientId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to send a memo",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('user_memos')
        .insert([{
          subject: subject.trim(),
          content: content.trim(),
          sender_id: user.id,
          recipient_id: recipientId,
          is_read: false,
        }]);

      if (error) {
        console.error('Error sending memo:', error);
        toast({
          title: "Error",
          description: "Failed to send memo. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Memo sent successfully",
        });

        // Reset form
        setSubject("");
        setContent("");
        setRecipientId("");

        // Callback to refresh parent component
        if (onMemoSent) {
          onMemoSent();
        }
      }
    } catch (error) {
      console.error('Error sending memo:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="recipient">Recipient</Label>
        <Select value={recipientId} onValueChange={setRecipientId} required>
          <SelectTrigger>
            <SelectValue placeholder="Select recipient" />
          </SelectTrigger>
          <SelectContent>
            {recipients.map((recipient) => (
              <SelectItem key={recipient.id} value={recipient.id}>
                {recipient.full_name} ({recipient.role})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter memo subject"
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter memo content"
          rows={6}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !subject.trim() || !content.trim() || !recipientId}
        className="w-full"
      >
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "Sending..." : "Send Memo"}
      </Button>
    </form>
  );
};
