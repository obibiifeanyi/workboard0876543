
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, recipient_id, subject, message, data } = await req.json();
    
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get recipient details
    const { data: recipient, error: recipientError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', recipient_id)
      .single();

    if (recipientError || !recipient?.email) {
      throw new Error('Recipient not found or no email address');
    }

    // Create in-app notification
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: recipient_id,
        title: subject,
        message: message,
        type: type,
        metadata: data
      });

    if (notificationError) {
      console.error('Failed to create in-app notification:', notificationError);
    }

    // Send email notification if enabled
    const { data: preferences } = await supabase
      .from('notification_preferences')
      .select('email_enabled')
      .eq('user_id', recipient_id)
      .single();

    if (preferences?.email_enabled !== false) {
      const emailResult = await resend.emails.send({
        from: 'CT Communication Towers <notifications@ai.ctnigeria.com>',
        to: recipient.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1a1a1a; margin: 0;">CT Communication Towers</h2>
            </div>
            
            <div style="padding: 20px;">
              <h3 style="color: #1a1a1a;">${subject}</h3>
              <p style="color: #666; line-height: 1.6;">${message}</p>
              
              ${data ? `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h4 style="margin: 0 0 10px 0; color: #1a1a1a;">Additional Details:</h4>
                  <pre style="color: #666; font-family: monospace; white-space: pre-wrap;">${JSON.stringify(data, null, 2)}</pre>
                </div>
              ` : ''}
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px;">
                  This is an automated notification from CT Communication Towers.
                  <br>
                  You can manage your notification preferences in your dashboard.
                </p>
              </div>
            </div>
          </div>
        `,
      });

      console.log('Email sent:', emailResult);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification sent successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in send-notification function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send notification' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
