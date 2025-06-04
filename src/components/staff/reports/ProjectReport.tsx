import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ProjectReport = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    report_title: "",
    report_type: "progress",
    report_content: "",
    project_id: "" // Will need to be set or selected
  });

  // Reset success state after delay
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitReport = async () => {
    // Reset states
    setErrorMessage(null);
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.report_title.trim() || !formData.report_content.trim() || !formData.project_id.trim()) {
      setErrorMessage("Please fill in all required fields");
      setIsSubmitting(false);
      toast({
        title: "Validation Error",
        description: "Project title, content, and project ID are required.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Authentication required");
      }
      
      // Submit report to database
      const { error } = await supabase
        .from('project_reports')
        .insert({
          report_title: formData.report_title,
          report_type: formData.report_type,
          report_content: formData.report_content,
          project_id: formData.project_id,
          created_by: user.id
        });
      
      if (error) throw error;
      
      // Handle success
      setIsSuccess(true);
      setFormData({
        report_title: "",
        report_type: "progress",
        report_content: "",
        project_id: ""
      });
      
      toast({
        title: "Report Submitted",
        description: "Your project report has been submitted successfully",
      });
    } catch (error: any) {
      console.error("Error submitting report:", error);
      setErrorMessage(error.message || "Failed to submit report");
      toast({
        title: "Error",
        description: error.message || "Failed to submit report. Please try again.",
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
          Project Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Title</label>
            <input
              type="text"
              name="report_title"
              value={formData.report_title}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
              placeholder="Enter report title"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
            <select 
              name="report_type"
              value={formData.report_type}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
            >
              <option value="progress">Progress Report</option>
              <option value="completion">Completion Report</option>
              <option value="issue">Issue Report</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Project ID</label>
          <input
            type="text"
            name="project_id"
            value={formData.project_id}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
            placeholder="Enter project ID"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Content</label>
          <textarea
            name="report_content"
            value={formData.report_content}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 bg-white/5 p-2 min-h-[100px]"
            placeholder="Enter detailed report..."
            required
          />
        </div>
        
        {errorMessage && (
          <div className="text-red-500 text-sm">{errorMessage}</div>
        )}
        
        {isSuccess && (
          <div className="text-green-500 text-sm">Report submitted successfully!</div>
        )}
        
        <Button 
          onClick={handleSubmitReport} 
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? "Submitting..." : (
            <>
              <Send className="h-4 w-4 mr-2" />
            </>
          )}
          Submit Report
        </Button>
      </CardContent>
    </Card>
  );
};