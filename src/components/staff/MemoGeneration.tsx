
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useMemoManagement } from "@/hooks/useMemoManagement";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";

export const MemoGeneration = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("draft");
  const [editingMemo, setEditingMemo] = useState<any>(null);
  
  const { 
    myMemos, 
    isLoadingMyMemos, 
    createMemo, 
    updateMemo, 
    deleteMemo 
  } = useMemoManagement();

  const handleSubmit = async () => {
    if (!title || !content || !department) {
      return;
    }

    if (editingMemo) {
      await updateMemo.mutateAsync({
        id: editingMemo.id,
        data: { title, content, department, status }
      });
      setEditingMemo(null);
    } else {
      await createMemo.mutateAsync({
        title,
        content,
        department,
        status,
      });
    }

    // Reset form
    setTitle("");
    setContent("");
    setDepartment("");
    setStatus("draft");
  };

  const handleEdit = (memo: any) => {
    setEditingMemo(memo);
    setTitle(memo.title);
    setContent(memo.content);
    setDepartment(memo.department || "");
    setStatus(memo.status);
  };

  const handleDelete = async (memoId: string) => {
    if (window.confirm("Are you sure you want to delete this memo?")) {
      await deleteMemo.mutateAsync(memoId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card border border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            {editingMemo ? "Edit Memo" : "Create New Memo"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="memo-title">Title</Label>
            <Input
              id="memo-title"
              placeholder="Enter memo title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="memo-department">Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IT">IT Department</SelectItem>
                <SelectItem value="HR">Human Resources</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="All">All Departments</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="memo-status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
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
              placeholder="Enter memo content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleSubmit}
              disabled={!title || !content || !department || createMemo.isPending || updateMemo.isPending}
              className="flex-1"
            >
              {createMemo.isPending || updateMemo.isPending 
                ? (editingMemo ? "Updating..." : "Creating...") 
                : (editingMemo ? "Update Memo" : "Create Memo")
              }
            </Button>
            {editingMemo && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingMemo(null);
                  setTitle("");
                  setContent("");
                  setDepartment("");
                  setStatus("draft");
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">My Memos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingMyMemos ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myMemos?.map((memo) => (
                  <TableRow key={memo.id}>
                    <TableCell className="font-medium">{memo.title}</TableCell>
                    <TableCell>{memo.department || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(memo.status)}>
                        {memo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(memo.created_at), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(memo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(memo.id)}
                          disabled={deleteMemo.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
