
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface HealthCheck {
  id: string;
  service_name: string;
  status: string;
  response_time_ms: number | null;
  error_message: string | null;
  checked_at: string;
}

export const SystemHealthMonitor = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthChecks = async () => {
      try {
        const { data, error } = await supabase
          .from('system_health')
          .select('*')
          .order('checked_at', { ascending: false })
          .limit(20);

        if (error) throw error;
        setHealthChecks(data || []);
      } catch (error) {
        console.error('Failed to fetch health checks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthChecks();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('system_health_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'system_health' }, 
        () => fetchHealthChecks()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'unhealthy':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          System Health Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {healthChecks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No health checks recorded yet
            </p>
          ) : (
            healthChecks.map((check) => (
              <div
                key={check.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <p className="font-medium">{check.service_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(check.checked_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {check.response_time_ms && (
                    <span className="text-sm text-muted-foreground">
                      {check.response_time_ms}ms
                    </span>
                  )}
                  <Badge className={getStatusColor(check.status)}>
                    {check.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
