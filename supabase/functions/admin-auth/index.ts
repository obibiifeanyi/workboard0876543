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

    const { email, password } = await req.json()

    // First, verify if the user exists and has admin role
    const { data: existingUser, error: userError } = await supabaseClient
      .from('profiles')
      .select('id, role')
      .eq('email', email)
      .single()

    if (userError || !existingUser || existingUser.role !== 'admin') {
      throw new Error('Invalid admin credentials')
    }

    // Attempt to sign in
    const { data: { user }, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) throw signInError

    // Log successful admin login
    await supabaseClient.from('system_activities').insert({
      type: 'auth',
      description: 'Admin login successful',
      user_id: user?.id,
      metadata: {
        email: user?.email,
        timestamp: new Date().toISOString(),
        ip: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown'
      }
    })

    return new Response(
      JSON.stringify({ 
        user, 
        profile: { role: 'admin' },
        message: 'Admin authentication successful'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Admin auth error:', error)
    
    // Log failed admin login attempt
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )
      
      await supabaseClient.from('system_activities').insert({
        type: 'auth_error',
        description: 'Admin login failed',
        metadata: {
          error: error.message,
          timestamp: new Date().toISOString(),
          ip: req.headers.get('x-forwarded-for') || 'unknown'
        }
      })
    } catch (logError) {
      console.error('Failed to log admin auth error:', logError)
    }

    return new Response(
      JSON.stringify({ 
        error: 'Invalid admin credentials',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      }
    )
  }
})