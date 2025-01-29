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
    const { content, type } = await req.json();
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Analyze content with OpenAI
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant specialized in analyzing ${type || 'content'}. Provide detailed analysis.`
          },
          {
            role: 'user',
            content
          }
        ],
      }),
    });

    const aiResult = await aiResponse.json();
    const analysis = aiResult.choices[0].message.content;

    // Store analysis result
    const { data: resultData, error: resultError } = await supabase
      .from('ai_results')
      .insert({
        query_text: content,
        result_data: analysis,
        model_used: 'gpt-4o-mini'
      })
      .select()
      .single();

    if (resultError) throw resultError;

    // Get managers and admins
    const { data: managers } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('role', ['manager', 'admin']);

    if (managers) {
      // Send email notifications
      for (const manager of managers) {
        await resend.emails.send({
          from: 'AI Analysis <notifications@workboard.com>',
          to: manager.email,
          subject: 'New AI Analysis Available',
          html: `
            <h2>New AI Analysis Report</h2>
            <p>Hello ${manager.full_name},</p>
            <p>A new AI analysis has been completed and requires your review.</p>
            <p>Analysis Summary:</p>
            <pre>${analysis.substring(0, 200)}...</pre>
            <p>Please log in to the dashboard to view the complete analysis.</p>
          `,
        });

        // Create in-app notification
        await supabase
          .from('notifications')
          .insert({
            user_id: manager.id,
            title: 'New AI Analysis Available',
            message: 'A new AI analysis has been completed and requires your review.',
            type: 'ai_analysis',
          });
      }
    }

    return new Response(
      JSON.stringify({ success: true, result: resultData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-and-notify function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});