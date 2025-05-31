
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { type, userId, data } = await req.json()

    // Get user profile and notification preferences
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', userId)
      .single()

    if (profileError || !profile?.email) {
      console.error('User profile not found:', profileError)
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check notification preferences
    const { data: preferences } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!preferences?.email_enabled) {
      console.log('Email notifications disabled for user:', userId)
      return new Response(JSON.stringify({ message: 'Email notifications disabled' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Generate email content based on notification type
    let subject = ''
    let htmlContent = ''

    switch (type) {
      case 'task_assigned':
        if (!preferences?.task_notifications) return new Response(JSON.stringify({ message: 'Task notifications disabled' }), { status: 200, headers: corsHeaders })
        subject = `New Task Assigned: ${data.title}`
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #dc2626, #b91c1c); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">CT Communication Towers</h1>
            </div>
            <div style="padding: 20px; background: #f9fafb;">
              <h2 style="color: #dc2626;">New Task Assigned</h2>
              <p>Hello ${profile.full_name || 'Team Member'},</p>
              <p>You have been assigned a new task:</p>
              <div style="background: white; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0;">
                <h3 style="margin: 0 0 10px 0; color: #1f2937;">${data.title}</h3>
                <p style="margin: 0; color: #6b7280;">${data.description || 'No description provided'}</p>
                <p style="margin: 10px 0 0 0;"><strong>Priority:</strong> ${data.priority || 'Medium'}</p>
                ${data.due_date ? `<p style="margin: 5px 0 0 0;"><strong>Due Date:</strong> ${new Date(data.due_date).toLocaleDateString()}</p>` : ''}
              </div>
              <p>Please log in to the system to view more details and start working on this task.</p>
            </div>
          </div>
        `
        break

      case 'project_assigned':
        subject = `Added to Project: ${data.name}`
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #dc2626, #b91c1c); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">CT Communication Towers</h1>
            </div>
            <div style="padding: 20px; background: #f9fafb;">
              <h2 style="color: #dc2626;">Project Assignment</h2>
              <p>Hello ${profile.full_name || 'Team Member'},</p>
              <p>You have been added to a new project:</p>
              <div style="background: white; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0;">
                <h3 style="margin: 0 0 10px 0; color: #1f2937;">${data.name}</h3>
                <p style="margin: 0; color: #6b7280;">${data.description || 'No description provided'}</p>
                <p style="margin: 10px 0 0 0;"><strong>Role:</strong> ${data.role || 'Member'}</p>
                <p style="margin: 5px 0 0 0;"><strong>Status:</strong> ${data.status || 'Planning'}</p>
              </div>
              <p>Please check the project dashboard for more details and your responsibilities.</p>
            </div>
          </div>
        `
        break

      case 'memo_received':
        if (!preferences?.memo_notifications) return new Response(JSON.stringify({ message: 'Memo notifications disabled' }), { status: 200, headers: corsHeaders })
        subject = `New Memo: ${data.subject}`
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #dc2626, #b91c1c); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">CT Communication Towers</h1>
            </div>
            <div style="padding: 20px; background: #f9fafb;">
              <h2 style="color: #dc2626;">New Memo</h2>
              <p>Hello ${profile.full_name || 'Team Member'},</p>
              <p>You have received a new memo:</p>
              <div style="background: white; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0;">
                <h3 style="margin: 0 0 10px 0; color: #1f2937;">${data.subject}</h3>
                <p style="margin: 0; color: #6b7280;">${data.content?.substring(0, 200)}${data.content?.length > 200 ? '...' : ''}</p>
              </div>
              <p>Please log in to read the full memo and any attached documents.</p>
            </div>
          </div>
        `
        break

      case 'leave_status_update':
        if (!preferences?.leave_notifications) return new Response(JSON.stringify({ message: 'Leave notifications disabled' }), { status: 200, headers: corsHeaders })
        subject = `Leave Request ${data.status}: ${data.leave_type}`
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #dc2626, #b91c1c); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">CT Communication Towers</h1>
            </div>
            <div style="padding: 20px; background: #f9fafb;">
              <h2 style="color: #dc2626;">Leave Request Update</h2>
              <p>Hello ${profile.full_name || 'Team Member'},</p>
              <p>Your leave request has been <strong>${data.status}</strong>:</p>
              <div style="background: white; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0;">
                <p><strong>Leave Type:</strong> ${data.leave_type}</p>
                <p><strong>Dates:</strong> ${new Date(data.start_date).toLocaleDateString()} - ${new Date(data.end_date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${data.status}</p>
                ${data.rejection_reason ? `<p><strong>Reason:</strong> ${data.rejection_reason}</p>` : ''}
              </div>
              <p>Please check your dashboard for more details.</p>
            </div>
          </div>
        `
        break

      default:
        subject = 'CT Communication Towers Notification'
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #dc2626, #b91c1c); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">CT Communication Towers</h1>
            </div>
            <div style="padding: 20px; background: #f9fafb;">
              <h2 style="color: #dc2626;">System Notification</h2>
              <p>Hello ${profile.full_name || 'Team Member'},</p>
              <p>You have a new notification from the CT Communication Towers system.</p>
              <p>Please log in to your dashboard to view the details.</p>
            </div>
          </div>
        `
    }

    // Send email notification
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: 'CT Communication Towers <notifications@ctnl.com>',
      to: [profile.email],
      subject: subject,
      html: htmlContent,
    })

    if (emailError) {
      console.error('Failed to send email:', emailError)
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Email sent successfully:', emailResult)

    // Create notification record in database
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: subject,
        message: `Email notification sent: ${subject}`,
        type: 'info',
        category: type.split('_')[0] || 'general',
        priority: 'normal'
      })

    if (notificationError) {
      console.error('Failed to create notification record:', notificationError)
    }

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult?.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
