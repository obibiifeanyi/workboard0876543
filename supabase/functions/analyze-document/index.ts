
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
    const { content, fileName, fileType, systemContext } = await req.json()

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'No content provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Analyzing document:', {
      fileName,
      fileType,
      contentLength: content.length,
      hasSystemContext: !!systemContext
    })

    // Get user ID from headers
    const userId = req.headers.get('x-user-id')

    // Try OpenAI first, fallback to Google AI
    let analysisResult;
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const googleKey = Deno.env.get('GOOGLE_AI_API_KEY');

    if (openaiKey) {
      analysisResult = await analyzeWithOpenAI(content, fileName, fileType, systemContext, openaiKey);
    } else if (googleKey) {
      analysisResult = await analyzeWithGoogleAI(content, fileName, fileType, systemContext, googleKey);
    } else {
      throw new Error('No AI API keys configured');
    }

    // Store the analysis result in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    try {
      const { data: analysisRecord, error: dbError } = await supabase
        .from('document_analysis')
        .insert({
          file_name: fileName,
          status: 'completed',
          analysis_result: analysisResult,
          created_by: userId
        })
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
      } else {
        console.log('Analysis saved to database:', analysisRecord.id)
      }
    } catch (dbError) {
      console.error('Failed to save to database:', dbError)
      // Continue anyway - don't fail the analysis if DB save fails
    }

    return new Response(
      JSON.stringify({ 
        analysis: analysisResult,
        success: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in analyze-document function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze document', 
        details: error.message,
        success: false 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function analyzeWithOpenAI(content: string, fileName: string, fileType: string, systemContext: any, apiKey: string) {
  const contextPrompt = systemContext ? `
  
SYSTEM CONTEXT FOR ANALYSIS:
Available Projects: ${JSON.stringify(systemContext.projects?.slice(0, 5) || [])}
Current Tasks: ${JSON.stringify(systemContext.tasks?.slice(0, 5) || [])}
Team Members: ${JSON.stringify(systemContext.profiles?.slice(0, 5) || [])}
Departments: ${JSON.stringify(systemContext.departments || [])}

Use this context to identify connections, relationships, and provide insights about how this document relates to existing organizational data. Look for mentions of project names, task descriptions, personnel names, or department-specific content.
` : '';

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
          content: `You are an advanced AI document analyzer for CT Communication Towers company. Analyze the provided document and return a comprehensive JSON response with the following structure:
          {
            "summary": "Detailed summary of the document content and purpose",
            "keyPoints": ["key point 1", "key point 2", ...],
            "suggestedActions": ["actionable recommendation 1", "actionable recommendation 2", ...],
            "categories": ["category1", "category2", ...] (use relevant business categories like: financial, technical, operational, legal, strategic, hr, safety, maintenance, project),
            "sentiment": "positive/negative/neutral/professional",
            "wordCount": number,
            "confidence": number (0.0 to 1.0),
            "documentType": "memo/report/contract/email/proposal/manual/specification/other",
            "urgency": "low/medium/high/critical",
            "technicalComplexity": "low/medium/high",
            "systemInsights": {
              "relatedProjects": [relevant projects from system context with explanations],
              "relevantTasks": [relevant tasks from system context with explanations],
              "connectedPersonnel": [relevant personnel from system context with explanations],
              "departmentContext": [relevant departments from system context with explanations]
            }
          }
          
          Focus on providing actionable insights relevant to telecommunications infrastructure, project management, and business operations.
          
          ${contextPrompt}`
        },
        {
          role: 'user',
          content: `Analyze this document (${fileName}, ${fileType}):\n\n${content.substring(0, 8000)}`
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
  }

  const result = await response.json()
  const analysisText = result.choices[0].message.content

  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(analysisText)
    
    // Ensure all required fields are present with defaults
    return {
      summary: parsed.summary || 'Document analyzed successfully',
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : ['Key insights extracted from document'],
      suggestedActions: Array.isArray(parsed.suggestedActions) ? parsed.suggestedActions : ['Review and categorize document'],
      categories: Array.isArray(parsed.categories) ? parsed.categories : ['general'],
      sentiment: parsed.sentiment || 'neutral',
      wordCount: parsed.wordCount || content.split(/\s+/).length,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.85,
      documentType: parsed.documentType || 'document',
      urgency: parsed.urgency || 'medium',
      technicalComplexity: parsed.technicalComplexity || 'medium',
      systemInsights: {
        relatedProjects: parsed.systemInsights?.relatedProjects || [],
        relevantTasks: parsed.systemInsights?.relevantTasks || [],
        connectedPersonnel: parsed.systemInsights?.connectedPersonnel || [],
        departmentContext: parsed.systemInsights?.departmentContext || []
      }
    }
  } catch (parseError) {
    console.error('Failed to parse AI response as JSON:', parseError)
    
    // Fallback: create structured response from text
    return {
      summary: analysisText.substring(0, 500) + '...',
      keyPoints: ["Document content analyzed", "Key information extracted", "Analysis completed successfully"],
      suggestedActions: ["Review the analysis results", "Take appropriate follow-up actions", "Archive document appropriately"],
      categories: ["general"],
      sentiment: "neutral",
      wordCount: content.split(/\s+/).length,
      confidence: 0.75,
      documentType: "document",
      urgency: "medium",
      technicalComplexity: "medium",
      systemInsights: {
        relatedProjects: [],
        relevantTasks: [],
        connectedPersonnel: [],
        departmentContext: []
      }
    }
  }
}

async function analyzeWithGoogleAI(content: string, fileName: string, fileType: string, systemContext: any, apiKey: string) {
  const contextPrompt = systemContext ? `
  
SYSTEM CONTEXT FOR ANALYSIS:
Available Projects: ${JSON.stringify(systemContext.projects?.slice(0, 5) || [])}
Current Tasks: ${JSON.stringify(systemContext.tasks?.slice(0, 5) || [])}
Team Members: ${JSON.stringify(systemContext.profiles?.slice(0, 5) || [])}
Departments: ${JSON.stringify(systemContext.departments || [])}

Use this context to identify connections and provide insights about document relationships.
` : '';

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Analyze this document (${fileName}, ${fileType}) and provide a comprehensive JSON response with summary, keyPoints, suggestedActions, categories, sentiment, wordCount, confidence, documentType, urgency, technicalComplexity, and systemInsights.
          
          ${contextPrompt}
          
          Document content:\n\n${content.substring(0, 6000)}`
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 3000
      }
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Google AI API error: ${response.status} - ${errorText}`)
  }

  const result = await response.json()
  const analysisText = result.candidates[0].content.parts[0].text

  try {
    const parsed = JSON.parse(analysisText)
    return {
      summary: parsed.summary || 'Document analyzed with Google AI',
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : ['Analysis completed'],
      suggestedActions: Array.isArray(parsed.suggestedActions) ? parsed.suggestedActions : ['Review results'],
      categories: Array.isArray(parsed.categories) ? parsed.categories : ['general'],
      sentiment: parsed.sentiment || 'neutral',
      wordCount: parsed.wordCount || content.split(/\s+/).length,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.80,
      documentType: parsed.documentType || 'document',
      urgency: parsed.urgency || 'medium',
      technicalComplexity: parsed.technicalComplexity || 'medium',
      systemInsights: parsed.systemInsights || {
        relatedProjects: [],
        relevantTasks: [],
        connectedPersonnel: [],
        departmentContext: []
      }
    }
  } catch (parseError) {
    // Fallback for Google AI
    return {
      summary: analysisText.substring(0, 500),
      keyPoints: ["Document analyzed with Google AI"],
      suggestedActions: ["Review analysis"],
      categories: ["general"],
      sentiment: "neutral",
      wordCount: content.split(/\s+/).length,
      confidence: 0.75,
      documentType: "document",
      urgency: "medium",
      technicalComplexity: "medium",
      systemInsights: {
        relatedProjects: [],
        relevantTasks: [],
        connectedPersonnel: [],
        departmentContext: []
      }
    }
  }
}
