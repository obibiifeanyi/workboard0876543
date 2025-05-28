
import { supabase } from '@/integrations/supabase/client';

export interface DocumentAnalysis {
  id: string;
  file_name: string;
  analysis_result: any;
  status: string;
  created_by: string;
  created_at: string;
}

export const analyzeDocument = async (file: File, userId: string): Promise<DocumentAnalysis> => {
  try {
    // Store analysis result in memos table for now
    const { data, error } = await supabase
      .from('memos')
      .insert({
        title: `Document Analysis: ${file.name}`,
        content: `Analysis of ${file.name} completed`,
        status: 'published',
        created_by: userId
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      file_name: file.name,
      analysis_result: { summary: data.content },
      status: data.status || 'completed',
      created_by: data.created_by || userId,
      created_at: data.created_at
    };
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw error;
  }
};

export const getDocumentAnalyses = async (userId: string): Promise<DocumentAnalysis[]> => {
  try {
    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .eq('created_by', userId)
      .like('title', 'Document Analysis:%')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(memo => ({
      id: memo.id,
      file_name: memo.title.replace('Document Analysis: ', ''),
      analysis_result: { summary: memo.content },
      status: memo.status || 'completed',
      created_by: memo.created_by || userId,
      created_at: memo.created_at
    }));
  } catch (error) {
    console.error('Error fetching document analyses:', error);
    throw error;
  }
};
