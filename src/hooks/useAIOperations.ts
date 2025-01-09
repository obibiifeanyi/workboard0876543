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
          .from('ai_results')
          .select('*');
        if (error) throw error;
        return data as AIResult[];
      },
    });
  };

  const useCreateAIResult = () => {
    return useMutation({
      mutationFn: async (newResult: Omit<AIResult, 'id' | 'created_at' | 'updated_at'>) => {
        const { data, error } = await supabase
          .from('ai_results')
          .insert(newResult)
          .select()
          .single();
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ai_results'] });
        toast({
          title: 'Success',
          description: 'AI result saved successfully',
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
          .from('ai_knowledge_base')
          .select('*');
        if (error) throw error;
        return data as AIKnowledgeBase[];
      },
    });
  };

  const useCreateKnowledgeEntry = () => {
    return useMutation({
      mutationFn: async (newEntry: Omit<AIKnowledgeBase, 'id' | 'created_at' | 'updated_at'>) => {
        const { data, error } = await supabase
          .from('ai_knowledge_base')
          .insert(newEntry)
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