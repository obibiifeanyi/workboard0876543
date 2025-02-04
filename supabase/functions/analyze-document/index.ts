
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { content, type, fileName } = await req.json()

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
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'CTNL AI Work Board'
      },
      body: JSON.stringify({
        model: 'google/gemma-7b-it',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant specialized in analyzing documents. Provide a detailed analysis including:
            1. A concise summary
            2. Key points and insights
            3. Action items or recommendations
            4. Any potential risks or concerns
            5. Relevant categories or tags`
          },
          {
            role: 'user',
            content: `Please analyze this ${type || 'document'}: ${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('OpenRouter API error:', result)
      throw new Error('Failed to analyze document')
    }

    const analysis = {
      summary: result.choices[0].message.content,
      keyPoints: extractKeyPoints(result.choices[0].message.content),
      suggestedActions: extractActions(result.choices[0].message.content),
      categories: extractCategories(result.choices[0].message.content),
      risks: extractRisks(result.choices[0].message.content)
    }

    // Store analysis result in Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    if (fileName) {
      await supabase
        .from('document_analysis')
        .insert({
          file_name: fileName,
          analysis_status: 'completed',
          analysis_result: analysis
        })
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

// Helper function to extract categories/tags
function extractCategories(content: string): string[] {
  const categories = content.match(/category|tag|topic|theme/gi)
    ? content.split('\n')
      .filter(line => line.toLowerCase().includes('category') || line.toLowerCase().includes('tag'))
      .map(line => line.replace(/^[^:]+:/, '').trim())
    : []
  return categories.length > 0 ? categories : ['General']
}

// Helper function to extract risks
function extractRisks(content: string): string[] {
  const riskKeywords = ['risk', 'concern', 'issue', 'problem', 'challenge', 'warning']
  const sentences = content.split('.')
  const risks = sentences
    .filter(sentence => 
      riskKeywords.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      )
    )
    .map(risk => risk.trim())
  return risks.length > 0 ? risks : []
}
