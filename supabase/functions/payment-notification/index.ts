import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { invoiceId, type, message } = await req.json()

    // Get invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from('accounts_invoices')
      .select('*, created_by')
      .eq('id', invoiceId)
      .single()

    if (invoiceError) throw invoiceError

    // Create notification for the staff member
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        recipient_id: invoice.created_by,
        title: `Payment ${type}`,
        content: message,
        type: 'payment'
      })

    if (notificationError) throw notificationError

    // Log the activity
    const { error: activityError } = await supabase
      .from('system_activities')
      .insert({
        type: 'payment',
        description: `Payment ${type} for invoice ${invoice.invoice_number}`,
        user_id: invoice.created_by,
        metadata: { invoiceId, status: type }
      })

    if (activityError) throw activityError

    console.log(`Payment notification sent for invoice ${invoiceId}`)

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in payment-notification function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})