import { useState } from "react";
import { Mail, Send, Bell, Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmailMessage {
  id: string;
  subject: string;
  content: string;
  recipients: string;
  timestamp: Date;
}

export const CommunicationCenter = () => {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipients, setRecipients] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendEmail = async () => {
    if (!subject || !content || !recipients) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // Simulate sending email
      const newEmail = {
        id: Date.now().toString(),
        subject,
        content,
        recipients,
        timestamp: new Date(),
      };

      setEmails((prev) => [newEmail, ...prev]);
      setSubject("");
      setContent("");
      setRecipients("");

      toast({
        title: "Email Sent",
        description: "Your email has been sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" />
          Communication Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="compose" className="space-y-4">
          <TabsList>
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4">
            <div className="space-y-4">
              <Input
                placeholder="Recipients (comma-separated emails)"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
              />
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <Textarea
                placeholder="Email content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
              />
              <Button
                onClick={handleSendEmail}
                disabled={isSending}
                className="w-full"
              >
                {isSending ? (
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Email
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sent">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {emails.map((email) => (
                  <Card key={email.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{email.subject}</h3>
                        <span className="text-sm text-muted-foreground">
                          {email.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        To: {email.recipients}
                      </p>
                      <p className="text-sm">{email.content}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};