
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

  // Temporarily return empty data until leave_requests table is created
  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      // Return empty array for now
      return [] as LeaveRequest[];
    },
  });

  const { data: myLeaveRequests, isLoading: isLoadingMyRequests } = useQuery({
    queryKey: ['my-leave-requests'],
    queryFn: async () => {
      // Return empty array for now
      return [] as LeaveRequest[];
    },
  });

  const submitLeaveRequest = useMutation({
    mutationFn: async (requestData: {
      start_date: string;
      end_date: string;
      leave_type: string;
      reason: string;
    }) => {
      // Temporarily just log the request
      console.log('Leave request submitted:', requestData);
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
      toast({
        title: "Error",
        description: "Failed to submit leave request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const approveLeaveRequest = useMutation({
    mutationFn: async (requestId: string) => {
      console.log('Approving leave request:', requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast({
        title: "Leave Approved",
        description: "The leave request has been approved.",
      });
    },
  });

  const rejectLeaveRequest = useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: string; reason: string }) => {
      console.log('Rejecting leave request:', requestId, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast({
        title: "Leave Rejected",
        description: "The leave request has been rejected.",
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
