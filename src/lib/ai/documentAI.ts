import { supabase } from '@/integrations/supabase/client';

export interface DocumentAnalysis {
  summary: string;
  keyPoints: string[];
  suggestedActions: string[];
}

export const analyzeDocument = async (content: string): Promise<DocumentAnalysis> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-document', {
      body: { content, type: 'document' }
    });

    if (error) {
      console.error('Error analyzing document:', error);
      throw error;
    }

    return data as DocumentAnalysis;
  } catch (error) {
    console.error('Error in analyzeDocument:', error);
    throw error;
  }
};