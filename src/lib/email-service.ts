import { supabase } from "@/integrations/supabase/client";

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: options,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendFormSubmissionNotification = async (
  formId: string,
  submissionId: string,
  submittedBy: string
) => {
  try {
    // Get form details
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select(`
        *,
        department:departments(
          name,
          manager:profiles!departments_manager_id_fkey(email)
        )
      `)
      .eq('id', formId)
      .single();

    if (formError) throw formError;

    // Get submission details
    const { data: submission, error: submissionError } = await supabase
      .from('form_submissions')
      .select(`
        *,
        submitted_by_user:profiles!form_submissions_submitted_by_fkey(
          full_name,
          email
        )
      `)
      .eq('id', submissionId)
      .single();

    if (submissionError) throw submissionError;

    // Send email to department manager
    if (form.department?.manager?.email) {
      await sendEmail({
        to: form.department.manager.email,
        subject: `New Form Submission: ${form.title}`,
        template: 'form-submission',
        data: {
          formTitle: form.title,
          departmentName: form.department.name,
          submittedBy: submission.submitted_by_user.full_name,
          submittedAt: new Date(submission.submitted_at).toLocaleString(),
          submissionData: submission.data,
        },
      });
    }

    // Send confirmation email to submitter
    if (submission.submitted_by_user.email) {
      await sendEmail({
        to: submission.submitted_by_user.email,
        subject: `Form Submission Confirmation: ${form.title}`,
        template: 'form-submission-confirmation',
        data: {
          formTitle: form.title,
          submittedAt: new Date(submission.submitted_at).toLocaleString(),
          submissionData: submission.data,
        },
      });
    }

    return true;
  } catch (error) {
    console.error('Error sending form submission notification:', error);
    throw error;
  }
};

export const sendDocumentAccessNotification = async (
  documentId: string,
  userId: string
) => {
  try {
    // Get document details
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select(`
        *,
        created_by_user:profiles!documents_created_by_fkey(
          full_name,
          email
        ),
        department:departments(
          name,
          manager:profiles!departments_manager_id_fkey(email)
        )
      `)
      .eq('id', documentId)
      .single();

    if (documentError) throw documentError;

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Send notification to document creator
    if (document.created_by_user?.email) {
      await sendEmail({
        to: document.created_by_user.email,
        subject: `Document Access: ${document.title}`,
        template: 'document-access',
        data: {
          documentTitle: document.title,
          accessedBy: user.full_name,
          accessedAt: new Date().toLocaleString(),
          departmentName: document.department?.name,
        },
      });
    }

    // Send notification to department manager
    if (document.department?.manager?.email) {
      await sendEmail({
        to: document.department.manager.email,
        subject: `Document Access: ${document.title}`,
        template: 'document-access',
        data: {
          documentTitle: document.title,
          accessedBy: user.full_name,
          accessedAt: new Date().toLocaleString(),
          departmentName: document.department.name,
        },
      });
    }

    return true;
  } catch (error) {
    console.error('Error sending document access notification:', error);
    throw error;
  }
}; 