
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Send } from "lucide-react";

export const MemoGeneration = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("draft");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentMemos, setRecentMemos] = useState([]);

  // Fetch recent memos
  useEffect(() => {
    const fetchRecentMemos = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('memos')
            .select('*')
            .eq('created_by', user.id)
            .order('created_at', { ascending: false })
            .limit(5);

          if (error) {
            console.error('Error fetching memos:', error);
          } else {
            setRecentMemos(data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching recent memos:', error);
      }
    };

    fetchRecentMemos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content",
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
          description: "You must be logged in to create a memo",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('memos')
        .insert([{
          title: title.trim(),
          content: content.trim(),
          department: department || null,
          status,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating memo:', error);
        toast({
          title: "Error",
          description: "Failed to create memo. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Memo created successfully",
        });

        // Reset form
        setTitle("");
        setContent("");
        setDepartment("");
        setStatus("draft");

        // Refresh recent memos
        setRecentMemos(prev => [data, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Error creating memo:', error);
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
    <div className="space-y-6">
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
                  <SelectValue placeholder="Select department (optional)" />
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
              <Select value={status} onValueChange={setStatus}>
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
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Creating..." : "Create Memo"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {recentMemos.length > 0 && (
        <Card className="glass-card border border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Recent Memos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMemos.map((memo) => (
                <div key={memo.id} className="p-3 border rounded-lg bg-background/50">
                  <h4 className="font-medium">{memo.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {memo.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span className={`px-2 py-1 rounded ${
                      memo.status === 'published' ? 'bg-green-100 text-green-800' :
                      memo.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {memo.status}
                    </span>
                    <span>{new Date(memo.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
