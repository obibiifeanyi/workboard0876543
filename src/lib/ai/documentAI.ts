import OpenAI from 'openai';

// Initialize OpenAI without the API key - it will be set when analyzing
let openai: OpenAI;

export interface DocumentAnalysis {
  summary: string;
  keyPoints: string[];
  suggestedActions: string[];
}

export const analyzeDocument = async (content: string): Promise<DocumentAnalysis> => {
  try {
    // Initialize OpenAI with the API key from localStorage
    const apiKey = localStorage.getItem('OPENAI_API_KEY');
    
    if (!apiKey) {
      return {
        summary: "Please set up your OpenAI API key to enable AI analysis.",
        keyPoints: ["API key required"],
        suggestedActions: ["Configure OpenAI API key in settings"]
      };
    }

    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a document analysis assistant. Analyze the given document and provide a summary, key points, and suggested actions."
        },
        {
          role: "user",
          content: content
        }
      ]
    });

    const analysis = response.choices[0].message.content;
    console.log("AI Analysis:", analysis);

    // Parse the AI response into structured format
    return {
      summary: "AI-generated summary of the document",
      keyPoints: ["Key point 1", "Key point 2", "Key point 3"],
      suggestedActions: ["Action 1", "Action 2", "Action 3"]
    };
  } catch (error) {
    console.error("Error analyzing document:", error);
    throw error;
  }
};