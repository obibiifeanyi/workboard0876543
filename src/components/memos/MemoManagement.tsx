
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Send, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMemoManagement } from "@/hooks/useMemoManagement";

export const MemoManagement = () => {
  const { createMemo } = useMemoManagement();
  const [subject, setSubject] = useState("");
  const [recipients, setRecipients] = useState("");
  const [content, setContent] = useState("");
  const [department, setDepartment] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subject || !content) {
      toast({
        title: "Missing Fields",
        description: "Please fill in subject and content",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMemo.mutateAsync({
        title: subject,
        content: content,
        department: department || "all",
        status: "published",
      });

      // Reset form
      setSubject("");
      setRecipients("");
      setContent("");
      setDepartment("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create departmental memo",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <FileText className="h-5 w-5 text-primary" />
          Create Departmental Memo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Memo Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Recipients (for reference)"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                className="bg-white/5 border-white/10"
                disabled
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Memo Content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[200px] rounded-md border border-white/10 bg-white/5 p-2"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={createMemo.isPending}
          >
            <Send className="h-4 w-4 mr-2" />
            {createMemo.isPending ? "Creating..." : "Create & Publish Memo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
