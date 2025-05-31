
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AuditLogEntry {
  action: string;
  tableName?: string;
  recordId?: string;
  oldValues?: any;
  newValues?: any;
}

export const useAuditLogger = () => {
  const { user } = useAuth();

  const logAction = useCallback(async (entry: AuditLogEntry) => {
    if (!user) return;

    try {
      // Get client info
      const userAgent = navigator.userAgent;
      const sessionId = localStorage.getItem('supabase.auth.token') || 'unknown';

      const { error } = await supabase.rpc('log_user_action', {
        p_action: entry.action,
        p_table_name: entry.tableName || null,
        p_record_id: entry.recordId || null,
        p_old_values: entry.oldValues ? JSON.stringify(entry.oldValues) : null,
        p_new_values: entry.newValues ? JSON.stringify(entry.newValues) : null
      });

      if (error) {
        console.error('Failed to log audit entry:', error);
      }
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  }, [user]);

  return { logAction };
};
