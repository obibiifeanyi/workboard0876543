
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { DocumentAnalysis } from '@/types/ai';

export const useAIOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useDocumentAnalyses = () => {
    return useQuery({
      queryKey: ['document_analyses'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('document_analysis')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as DocumentAnalysis[];
      },
    });
  };

  const useCreateDocumentAnalysis = () => {
    return useMutation({
      mutationFn: async (newAnalysis: Omit<DocumentAnalysis, 'id' | 'created_at' | 'updated_at'>) => {
        const { data, error } = await supabase
          .from('document_analysis')
          .insert(newAnalysis)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['document_analyses'] });
        toast({
          title: 'Success',
          description: 'Document analysis saved successfully',
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
    useDocumentAnalyses,
    useCreateDocumentAnalysis,
  };
};
