// @ts-ignore - Ignore missing type declarations
import React, { useState, useEffect, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Send, Users, AlertCircle, CheckCircle } from "lucide-react";
import { useStaffOperations } from "@/hooks/useStaffOperations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { StaffMemo } from "@/types/database";
import { ScrollArea } from "@/components/ui/scroll-area";

export const StaffMemos = () => {
  const { useMemos, createMemo } = useStaffOperations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Reset memo form state on success and clear success state after delay
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (isSuccess) {
      // Reset form data
      setFormData({
        recipient_id: '',
        subject: '',
        content: '',
        memo_type: 'general',
        priority: 'normal'
      });
      
      // Clear success state after delay
      timeoutId = setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSuccess]);
  const { data: memos = [], isLoading } = useMemos();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    recipient_id: '',
    subject: '',
    content: '',
    memo_type: 'general',
    priority: 'normal'
  });

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.recipient_id.trim()) {
      errors.push('Recipient ID is required');
    }
    
    if (!formData.subject.trim()) {
      errors.push('Subject is required');
    }
    
    if (!formData.content.trim()) {
      errors.push('Content is required');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors([]);
    
    // Validate form fields
    if (!validateForm()) {
      setIsSubmitting(false);
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form.',
        variant: 'destructive',
      });
      return;
    }
    
    // Call the mutation
    createMemo.mutate({
      recipient_id: formData.recipient_id,
      subject: formData.subject,
      content: formData.content,
      memo_type: formData.memo_type,
      priority: formData.priority,
      status: 'sent', // Add default status
      is_read: false // Add default read status
    }, {
      onSuccess: () => {
        setIsSuccess(true);
        setIsSubmitting(false);
        toast({
          title: 'Memo Sent',
          description: 'Your memo has been submitted successfully.',
        });
        setFormData({
          recipient_id: '',
          subject: '',
          content: '',
          memo_type: 'general',
          priority: 'normal'
        });
        
        // Success state is reset via useEffect
      },
      onError: (error: any) => {
        setIsSubmitting(false);
        const errorMsg = error?.message || 'Failed to submit memo';
        setValidationErrors([errorMsg]);
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
      }
    });
  };

  if (isLoading) {
    return <div>Loading memos...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compose New Memo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient_id">Recipient ID</Label>
              <Input
                id="recipient_id"
                value={formData.recipient_id}
                onChange={(e) => setFormData({ ...formData, recipient_id: e.target.value })}
                placeholder="Enter recipient ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Enter subject"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter content"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memo_type">Memo Type</Label>
              <Select 
                value={formData.memo_type} 
                onValueChange={(value) => setFormData({ ...formData, memo_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select memo type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
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
                  <span>Memo sent successfully!</span>
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Send className={`h-4 w-4 ${isSubmitting ? 'animate-spin' : ''}`} />
              {isSubmitting ? 'Sending...' : 'Send Memo'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Received Memos</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {memos.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {memos.map((memo) => (
                  <div key={memo.id} className="py-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{memo.subject}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">From: {memo.sender?.full_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">To: {memo.recipient?.full_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Priority: {memo.priority}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Type: {memo.memo_type}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sent at: {memo.created_at}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{memo.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No memos received.</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
