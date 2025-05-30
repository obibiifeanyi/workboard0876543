
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
        
        // Map database fields to DocumentAnalysis type
        return data.map(item => ({
          id: item.id,
          file_path: item.file_name, // Use file_name as file_path
          file_name: item.file_name,
          file_type: 'document', // Default type
          file_size: 0, // Default size
          analysis_status: item.status as 'pending' | 'completed' | 'error',
          analysis_result: item.analysis_result,
          created_by: item.created_by,
          created_at: item.created_at,
          updated_at: item.updated_at,
        })) as DocumentAnalysis[];
      },
    });
  };

  const useCreateDocumentAnalysis = () => {
    return useMutation({
      mutationFn: async (newAnalysis: Omit<DocumentAnalysis, 'id' | 'created_at' | 'updated_at'>) => {
        const { data, error } = await supabase
          .from('document_analysis')
          .insert({
            file_name: newAnalysis.file_name,
            status: newAnalysis.analysis_status,
            analysis_result: newAnalysis.analysis_result,
            created_by: newAnalysis.created_by,
          })
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

  // Add missing hooks for compatibility
  const useKnowledgeBase = () => {
    return useQuery({
      queryKey: ['ai_documents'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('ai_documents')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
    });
  };

  const useCreateKnowledgeEntry = () => {
    return useMutation({
      mutationFn: async (entry: { title: string; content: string; category: string; tags: string[]; created_by: string | null }) => {
        const { data, error } = await supabase
          .from('ai_documents')
          .insert(entry)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ai_documents'] });
        toast({
          title: 'Success',
          description: 'Knowledge entry created successfully',
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

  const useAIResults = () => {
    return useQuery({
      queryKey: ['document_analyses'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('document_analysis')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data.map(item => ({
          id: item.id,
          query_text: item.file_name,
          result_data: item.analysis_result,
          model_used: 'AI Analysis',
          created_by: item.created_by,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
      },
    });
  };

  return {
    useDocumentAnalyses,
    useCreateDocumentAnalysis,
    useKnowledgeBase,
    useCreateKnowledgeEntry,
    useAIResults,
  };
};
