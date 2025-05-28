
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
        // Use memos table as a placeholder for AI results
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
        // Use memos table for knowledge base entries
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
