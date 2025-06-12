import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const templates = {
  'form-submission': (data: any) => ({
    subject: `New Form Submission: ${data.formTitle}`,
    html: `
      <h2>New Form Submission</h2>
      <p><strong>Form:</strong> ${data.formTitle}</p>
      <p><strong>Department:</strong> ${data.departmentName}</p>
      <p><strong>Submitted By:</strong> ${data.submittedBy}</p>
      <p><strong>Submitted At:</strong> ${data.submittedAt}</p>
      <h3>Submission Data:</h3>
      <pre>${JSON.stringify(data.submissionData, null, 2)}</pre>
    `,
  }),
  'form-submission-confirmation': (data: any) => ({
    subject: `Form Submission Confirmation: ${data.formTitle}`,
    html: `
      <h2>Form Submission Confirmation</h2>
      <p>Your form submission has been received.</p>
      <p><strong>Form:</strong> ${data.formTitle}</p>
      <p><strong>Submitted At:</strong> ${data.submittedAt}</p>
      <h3>Your Submission:</h3>
      <pre>${JSON.stringify(data.submissionData, null, 2)}</pre>
    `,
  }),
  'document-access': (data: any) => ({
    subject: `Document Access: ${data.documentTitle}`,
    html: `
      <h2>Document Access Notification</h2>
      <p><strong>Document:</strong> ${data.documentTitle}</p>
      <p><strong>Accessed By:</strong> ${data.accessedBy}</p>
      <p><strong>Accessed At:</strong> ${data.accessedAt}</p>
      <p><strong>Department:</strong> ${data.departmentName}</p>
    `,
  }),
};

serve(async (req) => {
  try {
    const { to, subject, template, data } = await req.json();

    if (!to || !template || !data) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    const templateFn = templates[template];
    if (!templateFn) {
      return new Response(
        JSON.stringify({ error: 'Invalid template' }),
        { status: 400 }
      );
    }

    const { subject: templateSubject, html } = templateFn(data);

    const { data: emailData, error } = await resend.emails.send({
      from: 'WorkBoard <notifications@workboard.com>',
      to,
      subject: subject || templateSubject,
      html,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: emailData }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}); 