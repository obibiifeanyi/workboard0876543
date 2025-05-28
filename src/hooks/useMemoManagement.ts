
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Memo {
  id: string;
  title: string;
  content: string;
  department: string;
  status: 'draft' | 'published' | 'archived';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useMemoManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: memos, isLoading } = useQuery({
    queryKey: ['memos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Memo[];
    },
  });

  const { data: myMemos, isLoading: isLoadingMyMemos } = useQuery({
    queryKey: ['my-memos'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Memo[];
    },
  });

  const createMemo = useMutation({
    mutationFn: async (memoData: {
      title: string;
      content: string;
      department: string;
      status?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('memos')
        .insert({
          ...memoData,
          created_by: user.id,
          status: memoData.status || 'draft',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memos'] });
      queryClient.invalidateQueries({ queryKey: ['my-memos'] });
      toast({
        title: "Memo Created",
        description: "Your memo has been created successfully.",
      });
    },
  });

  const updateMemo = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Memo> }) => {
      const { error } = await supabase
        .from('memos')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memos'] });
      queryClient.invalidateQueries({ queryKey: ['my-memos'] });
      toast({
        title: "Memo Updated",
        description: "The memo has been updated successfully.",
      });
    },
  });

  const deleteMemo = useMutation({
    mutationFn: async (memoId: string) => {
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', memoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memos'] });
      queryClient.invalidateQueries({ queryKey: ['my-memos'] });
      toast({
        title: "Memo Deleted",
        description: "The memo has been deleted successfully.",
      });
    },
  });

  return {
    memos,
    myMemos,
    isLoading,
    isLoadingMyMemos,
    createMemo,
    updateMemo,
    deleteMemo,
  };
};
