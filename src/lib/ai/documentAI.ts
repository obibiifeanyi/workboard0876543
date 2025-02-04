
import { supabase } from '@/integrations/supabase/client';
import type { DocumentAnalysis } from '@/types/ai';

export const analyzeDocument = async (content: string): Promise<DocumentAnalysis> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-document', {
      body: { content, type: 'document' }
    });

    if (error) {
      console.error('Error analyzing document:', error);
      throw error;
    }

    // Create a document analysis record
    const { data: analysisRecord, error: dbError } = await supabase
      .from('document_analysis')
      .insert({
        file_name: 'Analyzed Document',
        file_type: 'text',
        file_size: content.length,
        analysis_status: 'completed',
        analysis_result: data
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error saving analysis:', dbError);
      throw dbError;
    }

    return analysisRecord as unknown as DocumentAnalysis;
  } catch (error) {
    console.error('Error in analyzeDocument:', error);
    throw error;
  }
};
