
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
        const { data, error } = await supabase
          .from('ai_documents')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data as unknown as AIResult[];
      },
    });
  };

  const useCreateAIResult = () => {
    return useMutation({
      mutationFn: async (newResult: Omit<AIResult, 'id' | 'created_at' | 'updated_at'>) => {
        const { data, error } = await supabase
          .from('ai_documents')
          .insert({
            title: newResult.query_text,
            content: JSON.stringify(newResult.result_data),
            document_type: newResult.model_used,
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
        const { data, error } = await supabase
          .from('ai_documents')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data as unknown as AIKnowledgeBase[];
      },
    });
  };

  const useCreateKnowledgeEntry = () => {
    return useMutation({
      mutationFn: async (newEntry: Omit<AIKnowledgeBase, 'id' | 'created_at' | 'updated_at'>) => {
        const { data, error } = await supabase
          .from('ai_documents')
          .insert({
            title: newEntry.title,
            content: newEntry.content,
            document_type: newEntry.category,
            analysis: JSON.stringify({ tags: newEntry.tags }),
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
