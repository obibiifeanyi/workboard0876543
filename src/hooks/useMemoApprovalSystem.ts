
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MemoWithApproval {
  id: string;
  title: string;
  content: string;
  department?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  created_by: string;
  created_at: string;
  updated_at: string;
  created_by_profile?: {
    full_name: string;
    email: string;
    department?: string;
  };
  memo_approvals?: Array<{
    id: string;
    status: 'pending' | 'approved' | 'rejected';
    approver_id: string;
    approval_date?: string;
    comments?: string;
    approver?: {
      full_name: string;
    };
  }>;
}

export const useMemoApprovalSystem = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch memos pending approval (for accountants)
  const { data: pendingMemos, isLoading: isLoadingPending } = useQuery({
    queryKey: ['pending_memos_approval'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memos')
        .select(`
          *,
          created_by_profile:profiles!memos_created_by_fkey(full_name, email, department),
          memo_approvals(
            *,
            approver:profiles!memo_approvals_approver_id_fkey(full_name)
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MemoWithApproval[];
    },
  });

  // Fetch all memos for current user
  const { data: userMemos, isLoading: isLoadingUserMemos } = useQuery({
    queryKey: ['user_memos'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('memos')
        .select(`
          *,
          created_by_profile:profiles!memos_created_by_fkey(full_name, email, department),
          memo_approvals(
            *,
            approver:profiles!memo_approvals_approver_id_fkey(full_name)
          )
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MemoWithApproval[];
    },
  });

  // Fetch approval history for accountants
  const { data: approvalHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['memo_approval_history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memo_approvals')
        .select(`
          *,
          memo:memos(title, content, created_by),
          approver:profiles!memo_approvals_approver_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });

  // Create new memo
  const createMemo = useMutation({
    mutationFn: async (memoData: {
      title: string;
      content: string;
      department?: string;
      status?: 'draft' | 'pending';
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('memos')
        .insert({
          ...memoData,
          created_by: user.id,
          status: memoData.status || 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      // If submitting for approval, create approval record
      if (memoData.status === 'pending') {
        const { error: approvalError } = await supabase
          .from('memo_approvals')
          .insert({
            memo_id: data.id,
            status: 'pending'
          });

        if (approvalError) throw approvalError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_memos'] });
      queryClient.invalidateQueries({ queryKey: ['pending_memos_approval'] });
      toast({
        title: "Success",
        description: "Memo created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create memo",
        variant: "destructive",
      });
    },
  });

  // Update memo
  const updateMemo = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MemoWithApproval> }) => {
      const { error } = await supabase
        .from('memos')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      // If changing status to pending, ensure approval record exists
      if (data.status === 'pending') {
        const { error: approvalError } = await supabase
          .from('memo_approvals')
          .upsert({
            memo_id: id,
            status: 'pending'
          });

        if (approvalError) throw approvalError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_memos'] });
      queryClient.invalidateQueries({ queryKey: ['pending_memos_approval'] });
      toast({
        title: "Success",
        description: "Memo updated successfully",
      });
    },
  });

  // Approve or reject memo (for accountants)
  const processApproval = useMutation({
    mutationFn: async ({ 
      memoId, 
      action, 
      comments 
    }: { 
      memoId: string; 
      action: 'approved' | 'rejected'; 
      comments?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update or create approval record
      const { error: approvalError } = await supabase
        .from('memo_approvals')
        .upsert({
          memo_id: memoId,
          approver_id: user.id,
          status: action,
          approval_date: new Date().toISOString(),
          comments: comments || null
        });

      if (approvalError) throw approvalError;

      // Update memo status
      const { error: memoError } = await supabase
        .from('memos')
        .update({ status: action })
        .eq('id', memoId);

      if (memoError) throw memoError;
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ['pending_memos_approval'] });
      queryClient.invalidateQueries({ queryKey: ['memo_approval_history'] });
      queryClient.invalidateQueries({ queryKey: ['user_memos'] });
      toast({
        title: "Success",
        description: `Memo ${action} successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process approval",
        variant: "destructive",
      });
    },
  });

  // Delete memo
  const deleteMemo = useMutation({
    mutationFn: async (memoId: string) => {
      // Delete approval records first
      await supabase
        .from('memo_approvals')
        .delete()
        .eq('memo_id', memoId);

      // Delete memo
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', memoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_memos'] });
      queryClient.invalidateQueries({ queryKey: ['pending_memos_approval'] });
      toast({
        title: "Success",
        description: "Memo deleted successfully",
      });
    },
  });

  return {
    // Data
    pendingMemos,
    userMemos,
    approvalHistory,
    
    // Loading states
    isLoadingPending,
    isLoadingUserMemos,
    isLoadingHistory,
    
    // Mutations
    createMemo,
    updateMemo,
    processApproval,
    deleteMemo,
  };
};
