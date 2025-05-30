
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
    const { content, fileName, fileType } = await req.json()

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'No content provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Try OpenAI first, fallback to Google AI
    let analysisResult;
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const googleKey = Deno.env.get('GOOGLE_AI_API_KEY');

    if (openaiKey) {
      analysisResult = await analyzeWithOpenAI(content, fileName, fileType, openaiKey);
    } else if (googleKey) {
      analysisResult = await analyzeWithGoogleAI(content, fileName, fileType, googleKey);
    } else {
      throw new Error('No AI API keys configured');
    }

    // Store the analysis result
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: analysisRecord, error: dbError } = await supabase
      .from('document_analysis')
      .insert({
        file_name: fileName,
        file_path: `ai-analysis/${Date.now()}-${fileName}`,
        file_type: fileType,
        file_size: content.length,
        analysis_status: 'completed',
        analysis_result: analysisResult,
        created_by: req.headers.get('x-user-id')
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
    }

    return new Response(
      JSON.stringify({ 
        analysis: analysisResult,
        record: analysisRecord
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in analyze-document function:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to analyze content', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function analyzeWithOpenAI(content: string, fileName: string, fileType: string, apiKey: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an AI document analyzer. Analyze the provided document and return a JSON response with the following structure:
          {
            "summary": "Brief summary of the document",
            "keyPoints": ["key point 1", "key point 2", ...],
            "suggestedActions": ["action 1", "action 2", ...],
            "categories": ["category1", "category2", ...],
            "sentiment": "positive/negative/neutral",
            "wordCount": number
          }`
        },
        {
          role: 'user',
          content: `Analyze this document (${fileName}, ${fileType}):\n\n${content}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    })
  })

  const result = await response.json()
  const analysisText = result.choices[0].message.content

  try {
    return JSON.parse(analysisText)
  } catch {
    // Fallback if JSON parsing fails
    return {
      summary: analysisText,
      keyPoints: ["Analysis completed"],
      suggestedActions: ["Review the document"],
      categories: ["General"],
      sentiment: "neutral",
      wordCount: content.split(/\s+/).length
    }
  }
}

async function analyzeWithGoogleAI(content: string, fileName: string, fileType: string, apiKey: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Analyze this document (${fileName}, ${fileType}) and provide a JSON response with summary, keyPoints, suggestedActions, categories, sentiment, and wordCount:\n\n${content}`
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2000
      }
    })
  })

  const result = await response.json()
  const analysisText = result.candidates[0].content.parts[0].text

  try {
    return JSON.parse(analysisText)
  } catch {
    // Fallback if JSON parsing fails
    return {
      summary: analysisText,
      keyPoints: ["Analysis completed"],
      suggestedActions: ["Review the document"],
      categories: ["General"],
      sentiment: "neutral",
      wordCount: content.split(/\s+/).length
    }
  }
}
