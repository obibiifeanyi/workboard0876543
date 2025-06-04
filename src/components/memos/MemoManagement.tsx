
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Send, Users, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMemoManagement } from "@/hooks/useMemoManagement";

export const MemoManagement = () => {
  const { createMemo } = useMemoManagement();
  const [subject, setSubject] = useState("");
  const [recipients, setRecipients] = useState("");
  const [content, setContent] = useState("");
  const [department, setDepartment] = useState("");
  const { toast } = useToast();
  
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Reset success state after delay
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (isSuccess) {
      timeoutId = setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSuccess]);

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!subject.trim()) {
      errors.push("Subject is required");
    }
    
    if (!content.trim()) {
      errors.push("Content is required");
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors([]);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
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

      // Show success message
      setIsSuccess(true);
      toast({
        title: "Success",
        description: "Departmental memo created and published successfully",
      });
      
      // Reset form
      setSubject("");
      setRecipients("");
      setContent("");
      setDepartment("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create departmental memo",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
          
          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-md mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
                <span className="font-medium">Please fix the following errors:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 pl-2">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Success message */}
          {isSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-3 rounded-md mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                <span>Memo created and published successfully!</span>
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={isSubmitting || createMemo.isPending}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting || createMemo.isPending ? "Creating..." : "Create & Publish Memo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
