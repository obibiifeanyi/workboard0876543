import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { sendFormSubmissionNotification } from '@/lib/email-service';

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  order: number;
}

interface Form {
  id: string;
  title: string;
  description: string;
  department_id: string;
  fields: FormField[];
}

interface FormSubmissionProps {
  formId: string;
}

export function FormSubmission({ formId }: FormSubmissionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Fetch form details
  const { data: form, isLoading: isLoadingForm } = useQuery({
    queryKey: ['form', formId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forms')
        .select(`
          *,
          fields:form_fields(*)
        `)
        .eq('id', formId)
        .single();

      if (error) throw error;
      return data as Form;
    },
  });

  // Submit form mutation
  const submitMutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const { data: submission, error } = await supabase
        .from('form_submissions')
        .insert({
          form_id: formId,
          data,
        })
        .select()
        .single();

      if (error) throw error;
      return submission;
    },
    onSuccess: async (submission) => {
      // Send email notifications
      await sendFormSubmissionNotification(
        formId,
        submission.id,
        submission.submitted_by
      );

      // Show success message
      toast({
        title: 'Form Submitted',
        description: 'Your form has been submitted successfully.',
      });

      // Reset form data
      setFormData({});

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['form-submissions', formId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to submit form. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  if (isLoadingForm) {
    return <div>Loading form...</div>;
  }

  if (!form) {
    return <div>Form not found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{form.title}</CardTitle>
        {form.description && <p className="text-muted-foreground">{form.description}</p>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields
            .sort((a, b) => a.order - b.order)
            .map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </Label>

                {field.type === 'text' && (
                  <Input
                    id={field.id}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                  />
                )}

                {field.type === 'textarea' && (
                  <Textarea
                    id={field.id}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                  />
                )}

                {field.type === 'select' && field.options && (
                  <Select
                    value={formData[field.id] || ''}
                    onValueChange={(value) => handleInputChange(field.id, value)}
                    required={field.required}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {field.type === 'checkbox' && (
                  <Checkbox
                    id={field.id}
                    checked={formData[field.id] || false}
                    onCheckedChange={(checked) => handleInputChange(field.id, checked)}
                    required={field.required}
                  />
                )}
              </div>
            ))}

          <Button
            type="submit"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
