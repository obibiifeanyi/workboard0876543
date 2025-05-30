
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface LeaveRequest {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  leave_type: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
}

export const useLeaveRequests = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all leave requests (for managers/admins)
  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leave requests:', error);
        throw error;
      }

      return data as LeaveRequest[];
    },
  });

  // Fetch current user's leave requests
  const { data: myLeaveRequests, isLoading: isLoadingMyRequests } = useQuery({
    queryKey: ['my-leave-requests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('leave_requests' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user leave requests:', error);
        throw error;
      }

      return data as LeaveRequest[];
    },
  });

  const submitLeaveRequest = useMutation({
    mutationFn: async (requestData: {
      start_date: string;
      end_date: string;
      leave_type: string;
      reason: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('leave_requests' as any)
        .insert([
          {
            user_id: user.id,
            start_date: requestData.start_date,
            end_date: requestData.end_date,
            leave_type: requestData.leave_type,
            reason: requestData.reason,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error submitting leave request:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      queryClient.invalidateQueries({ queryKey: ['my-leave-requests'] });
      toast({
        title: "Leave Request Submitted",
        description: "Your leave request has been submitted for approval.",
      });
    },
    onError: (error) => {
      console.error('Submit leave request error:', error);
      toast({
        title: "Error",
        description: "Failed to submit leave request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const approveLeaveRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('leave_requests' as any)
        .update({
          status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) {
        console.error('Error approving leave request:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast({
        title: "Leave Approved",
        description: "The leave request has been approved.",
      });
    },
    onError: (error) => {
      console.error('Approve leave request error:', error);
      toast({
        title: "Error",
        description: "Failed to approve leave request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const rejectLeaveRequest = useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: string; reason: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('leave_requests' as any)
        .update({
          status: 'rejected',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          rejection_reason: reason,
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) {
        console.error('Error rejecting leave request:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast({
        title: "Leave Rejected",
        description: "The leave request has been rejected.",
      });
    },
    onError: (error) => {
      console.error('Reject leave request error:', error);
      toast({
        title: "Error",
        description: "Failed to reject leave request. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    leaveRequests,
    myLeaveRequests,
    isLoading,
    isLoadingMyRequests,
    submitLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
  };
};
