
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { AIResult, AIKnowledgeBase } from '@/types/ai';

export const useAIOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useAIResults = () => {
    return useQuery({
      queryKey: ['ai_results'],
      queryFn: async () => {
        // Try to use document_analysis table first
        const { data: analysisData, error: analysisError } = await supabase
          .from('document_analysis')
          .select('*')
          .order('created_at', { ascending: false });

        if (!analysisError && analysisData) {
          return analysisData.map(analysis => ({
            id: analysis.id,
            query_text: `Document Analysis: ${analysis.file_name}`,
            result_data: analysis.analysis_result || { summary: 'Analysis completed' },
            model_used: 'gpt-3.5-turbo',
            created_by: analysis.created_by,
            created_at: analysis.created_at
          })) as unknown as AIResult[];
        }

        // Fallback to memos table
        const { data, error } = await supabase
          .from('memos')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        
        return (data || []).map(memo => ({
          id: memo.id,
          query_text: memo.title,
          result_data: { summary: memo.content || '' },
          model_used: 'gpt-3.5-turbo',
          created_by: memo.created_by,
          created_at: memo.created_at
        })) as unknown as AIResult[];
      },
    });
  };

  const useCreateAIResult = () => {
    return useMutation({
      mutationFn: async (newResult: Omit<AIResult, 'id' | 'created_at' | 'updated_at'>) => {
        // Try to use document_analysis table first
        const { data: analysisData, error: analysisError } = await supabase
          .from('document_analysis')
          .insert({
            file_name: newResult.query_text,
            analysis_result: newResult.result_data,
            status: 'completed',
            created_by: newResult.created_by
          })
          .select()
          .single();

        if (!analysisError && analysisData) {
          return analysisData;
        }

        // Fallback to memos table
        const { data, error } = await supabase
          .from('memos')
          .insert({
            title: newResult.query_text,
            content: JSON.stringify(newResult.result_data),
            status: 'published',
            created_by: newResult.created_by
          })
          .select()
          .single();
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ai_results'] });
        toast({
          title: 'Success',
          description: 'AI analysis saved successfully',
        });
      },
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  const useKnowledgeBase = () => {
    return useQuery({
      queryKey: ['ai_knowledge_base'],
      queryFn: async () => {
        // Try to use ai_documents table first
        const { data: aiDocsData, error: aiDocsError } = await supabase
          .from('ai_documents')
          .select('*')
          .order('created_at', { ascending: false });

        if (!aiDocsError && aiDocsData) {
          return aiDocsData.map(doc => ({
            id: doc.id,
            title: doc.title,
            content: doc.content,
            category: doc.category || 'general',
            tags: doc.tags || [],
            created_by: doc.created_by,
            created_at: doc.created_at
          })) as unknown as AIKnowledgeBase[];
        }

        // Fallback to memos table
        const { data, error } = await supabase
          .from('memos')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });
        if (error) throw error;
        
        return (data || []).map(memo => ({
          id: memo.id,
          title: memo.title,
          content: memo.content || '',
          category: memo.department || 'general',
          tags: [],
          created_by: memo.created_by,
          created_at: memo.created_at
        })) as unknown as AIKnowledgeBase[];
      },
    });
  };

  const useCreateKnowledgeEntry = () => {
    return useMutation({
      mutationFn: async (newEntry: Omit<AIKnowledgeBase, 'id' | 'created_at' | 'updated_at'>) => {
        // Try to use ai_documents table first
        const { data: aiDocData, error: aiDocError } = await supabase
          .from('ai_documents')
          .insert({
            title: newEntry.title,
            content: newEntry.content,
            category: newEntry.category,
            tags: newEntry.tags,
            created_by: newEntry.created_by
          })
          .select()
          .single();

        if (!aiDocError && aiDocData) {
          return aiDocData;
        }

        // Fallback to memos table
        const { data, error } = await supabase
          .from('memos')
          .insert({
            title: newEntry.title,
            content: newEntry.content,
            department: newEntry.category,
            status: 'published',
            created_by: newEntry.created_by
          })
          .select()
          .single();
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ai_knowledge_base'] });
        toast({
          title: 'Success',
          description: 'Knowledge base entry added successfully',
        });
      },
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return {
    useAIResults,
    useCreateAIResult,
    useKnowledgeBase,
    useCreateKnowledgeEntry,
  };
};
