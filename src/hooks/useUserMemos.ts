
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UserMemo {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
}

export const useUserMemos = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all users for recipient selection
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .neq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      return data as UserProfile[];
    },
  });

  // Fetch received memos
  const { data: receivedMemos, isLoading: isLoadingReceived } = useQuery({
    queryKey: ['received-memos'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_memos')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserMemo[];
    },
  });

  // Fetch sent memos
  const { data: sentMemos, isLoading: isLoadingSent } = useQuery({
    queryKey: ['sent-memos'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_memos')
        .select('*')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserMemo[];
    },
  });

  // Send memo mutation
  const sendMemo = useMutation({
    mutationFn: async (memoData: {
      recipient_id: string;
      subject: string;
      content: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_memos')
        .insert({
          sender_id: user.id,
          recipient_id: memoData.recipient_id,
          subject: memoData.subject,
          content: memoData.content,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sent-memos'] });
      toast({
        title: "Memo Sent",
        description: "Your memo has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send memo. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mark memo as read mutation
  const markAsRead = useMutation({
    mutationFn: async (memoId: string) => {
      const { error } = await supabase
        .from('user_memos')
        .update({ is_read: true })
        .eq('id', memoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['received-memos'] });
    },
  });

  return {
    users,
    receivedMemos,
    sentMemos,
    isLoadingUsers,
    isLoadingReceived,
    isLoadingSent,
    sendMemo,
    markAsRead,
  };
};
