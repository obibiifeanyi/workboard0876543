import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user data from request
    const { email, password } = await req.json()

    // Sign in user
    const { data: { user }, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) throw signInError

    // Verify admin role
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single()

    if (profileError) throw profileError

    if (profile.role !== 'admin') {
      throw new Error('Unauthorized: User is not an admin')
    }

    // Create system activity log
    await supabaseClient.from('system_activities').insert({
      type: 'auth',
      description: 'Admin login successful',
      user_id: user?.id,
      metadata: {
        email: user?.email,
        timestamp: new Date().toISOString(),
      }
    })

    return new Response(
      JSON.stringify({ user, profile }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})