
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemoManagement } from "@/hooks/useMemoManagement";
import { FileText, Send } from "lucide-react";

export const MemoGeneration = () => {
  const { createMemo } = useMemoManagement();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await createMemo.mutateAsync({
      title,
      content,
      department,
      status,
    });

    // Reset form
    setTitle("");
    setContent("");
    setDepartment("");
    setStatus("draft");
  };

  return (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <FileText className="h-6 w-6" />
          Create Memo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="memo-title">Title</Label>
            <Input
              id="memo-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter memo title"
              required
            />
          </div>

          <div>
            <Label htmlFor="memo-department">Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
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

          <div>
            <Label htmlFor="memo-status">Status</Label>
            <Select value={status} onValueChange={(value: "draft" | "published" | "archived") => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="memo-content">Content</Label>
            <Textarea
              id="memo-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter memo content"
              rows={6}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={createMemo.isPending || !title.trim() || !content.trim()}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {createMemo.isPending ? "Creating..." : "Create Memo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
