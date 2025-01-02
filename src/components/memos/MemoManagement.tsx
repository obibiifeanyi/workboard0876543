import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Send, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MemoManagement = () => {
  const [subject, setSubject] = useState("");
  const [recipients, setRecipients] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subject || !recipients || !content) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Memo Generated",
      description: "Your memo has been generated and sent successfully",
    });

    // Reset form
    setSubject("");
    setRecipients("");
    setContent("");
  };

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <FileText className="h-5 w-5 text-primary" />
          Generate Memo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Memo Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Recipients (comma separated)"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
          <textarea
            placeholder="Memo Content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[200px] rounded-md border border-white/10 bg-white/5 p-2"
          />
          <Button type="submit" className="w-full md:w-auto">
            <Send className="h-4 w-4 mr-2" />
            Generate & Send Memo
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};