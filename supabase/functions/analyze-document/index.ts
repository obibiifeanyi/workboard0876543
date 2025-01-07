import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { content, type } = await req.json()

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'No content provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // OpenRouter API configuration
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev', // Replace with your actual domain
        'X-Title': 'CTNL AI Work Board'
      },
      body: JSON.stringify({
        model: 'google/gemma-7b-it', // Using Gemma 7B instruction-tuned model
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant specialized in analyzing ${type || 'documents'}. Provide detailed analysis including key points, summary, and suggested actions.`
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('OpenRouter API error:', result)
      throw new Error('Failed to analyze document')
    }

    // Extract the AI response
    const analysis = {
      summary: result.choices[0].message.content,
      keyPoints: extractKeyPoints(result.choices[0].message.content),
      suggestedActions: extractActions(result.choices[0].message.content)
    }

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in analyze-document function:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to analyze document', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Helper function to extract key points from the AI response
function extractKeyPoints(content: string): string[] {
  // Simple extraction based on bullet points or numbered lists
  const points = content.split('\n')
    .filter(line => line.trim().match(/^[\d-•*]|\[\d+\]/))
    .map(point => point.replace(/^[\d-•*\[\]]+/, '').trim())
  return points.length > 0 ? points : [content.split('.')[0]]
}

// Helper function to extract suggested actions
function extractActions(content: string): string[] {
  const actionKeywords = ['should', 'must', 'recommend', 'suggest', 'consider', 'need to', 'action']
  const sentences = content.split('.')
  const actions = sentences
    .filter(sentence => 
      actionKeywords.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      )
    )
    .map(action => action.trim())
  return actions.length > 0 ? actions : ['Review the analyzed content']
}