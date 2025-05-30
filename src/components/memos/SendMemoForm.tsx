
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserMemos } from "@/hooks/useUserMemos";
import { Send } from "lucide-react";

export const SendMemoForm = () => {
  const { users, sendMemo, isLoadingUsers } = useUserMemos();
  const [recipientId, setRecipientId] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientId || !subject.trim() || !content.trim()) {
      return;
    }

    await sendMemo.mutateAsync({
      recipient_id: recipientId,
      subject,
      content,
    });

    // Reset form
    setRecipientId("");
    setSubject("");
    setContent("");
  };

  return (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Send className="h-6 w-6" />
          Send Memo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="recipient">Recipient</Label>
            <Select value={recipientId} onValueChange={setRecipientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingUsers ? (
                  <SelectItem value="" disabled>
                    Loading users...
                  </SelectItem>
                ) : (
                  users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name} ({user.email})
                    </SelectItem>
                  ))
                )}
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
            <Label htmlFor="content">Message</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your message"
              rows={6}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={sendMemo.isPending || !recipientId || !subject.trim() || !content.trim()}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {sendMemo.isPending ? "Sending..." : "Send Memo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
