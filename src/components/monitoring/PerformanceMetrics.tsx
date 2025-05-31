
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Clock, Database, Zap } from 'lucide-react';

interface Metric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  recorded_at: string;
}

interface MetricSummary {
  name: string;
  current: number;
  unit: string;
  trend: number;
  icon: any;
}

export const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [summaries, setSummaries] = useState<MetricSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch recent metrics
        const { data, error } = await supabase
          .from('performance_metrics')
          .select('*')
          .order('recorded_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        setMetrics(data || []);

        // Calculate summaries
        const metricGroups = (data || []).reduce((acc: any, metric) => {
          if (!acc[metric.metric_name]) {
            acc[metric.metric_name] = [];
          }
          acc[metric.metric_name].push(metric);
          return acc;
        }, {});

        const summaryData: MetricSummary[] = Object.entries(metricGroups).map(([name, values]: [string, any]) => {
          const latest = values[0];
          const previous = values[1];
          const trend = previous ? ((latest.metric_value - previous.metric_value) / previous.metric_value) * 100 : 0;

          return {
            name,
            current: latest.metric_value,
            unit: latest.metric_unit || '',
            trend,
            icon: getMetricIcon(name)
          };
        });

        setSummaries(summaryData);
      } catch (error) {
        console.error('Failed to fetch performance metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getMetricIcon = (metricName: string) => {
    if (metricName.includes('response_time')) return Clock;
    if (metricName.includes('database')) return Database;
    if (metricName.includes('memory') || metricName.includes('cpu')) return Zap;
    return Activity;
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'ms') return `${value.toFixed(2)}ms`;
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'MB') return `${value.toFixed(1)}MB`;
    return value.toString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading metrics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaries.map((summary) => {
          const Icon = summary.icon;
          return (
            <Card key={summary.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground capitalize">
                      {summary.name.replace(/_/g, ' ')}
                    </p>
                    <p className="text-2xl font-bold">
                      {formatValue(summary.current, summary.unit)}
                    </p>
                    <p className={`text-xs ${summary.trend >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {summary.trend >= 0 ? '+' : ''}{summary.trend.toFixed(1)}%
                    </p>
                  </div>
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Metrics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.slice(0, 50).reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="recorded_at" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: any, name: any) => [
                    formatValue(value, metrics.find(m => m.metric_name === name)?.metric_unit || ''),
                    name.replace(/_/g, ' ')
                  ]}
                />
                {summaries.map((summary, index) => (
                  <Line
                    key={summary.name}
                    type="monotone"
                    dataKey="metric_value"
                    stroke={`hsl(${index * 60}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
