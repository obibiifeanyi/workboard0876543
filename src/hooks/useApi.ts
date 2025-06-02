
import { useState, useEffect, useCallback } from "react";
import { ApiService } from "@/services/api";

export function useApi<T = any>(
  apiCall: () => Promise<{ success: boolean; data?: T; error?: string }>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      if (result.success) {
        setData(result.data || null);
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch };
}

export function useApiMutation<T = any, P = any>(
  apiCall: (params: P) => Promise<{ success: boolean; data?: T; error?: string }>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (params: P): Promise<{ success: boolean; data?: T }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall(params);
      if (!result.success) {
        setError(result.error || 'An error occurred');
      }
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return { mutate, loading, error };
}

// Specific hooks for common operations
export function useDepartments() {
  return useApi(() => ApiService.getDepartments());
}

export function useProjects() {
  return useApi(() => ApiService.getProjects());
}

export function useSites() {
  return useApi(() => ApiService.getSites());
}

export function useWeeklyReports(userId?: string) {
  return useApi(() => ApiService.getWeeklyReports(userId), [userId]);
}

export function useMemos(userId?: string) {
  return useApi(() => ApiService.getMemos(userId), [userId]);
}

export function useNotifications(userId: string) {
  return useApi(() => ApiService.getNotifications(userId), [userId]);
}

export function useDocuments() {
  return useApi(() => ApiService.getDocuments());
}

export function useBatteryReports() {
  return useApi(() => ApiService.getBatteryReports());
}

export function useTelecomReports() {
  return useApi(() => ApiService.getTelecomReports());
}

export function useLeaveRequests(userId?: string) {
  return useApi(() => ApiService.getLeaveRequests(userId), [userId]);
}
