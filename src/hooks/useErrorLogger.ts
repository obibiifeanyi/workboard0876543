
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ErrorLogEntry {
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  url?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  metadata?: any;
}

export const useErrorLogger = () => {
  const { user } = useAuth();

  const logError = useCallback(async (entry: ErrorLogEntry) => {
    try {
      const { error } = await supabase
        .from('error_logs')
        .insert({
          user_id: user?.id || null,
          error_type: entry.errorType,
          error_message: entry.errorMessage,
          stack_trace: entry.stackTrace || null,
          url: entry.url || window.location.href,
          user_agent: navigator.userAgent,
          severity: entry.severity || 'error',
          metadata: entry.metadata || null
        });

      if (error) {
        console.error('Failed to log error:', error);
      }
    } catch (logError) {
      console.error('Error logging failed:', logError);
    }
  }, [user]);

  return { logError };
};
