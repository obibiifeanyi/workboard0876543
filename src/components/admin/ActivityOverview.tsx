
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "lucide-react";

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  created_at: string;
  user_id?: string;
}

export const ActivityOverview = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent_activities'],
    queryFn: async () => {
      // Get recent memos, invoices, and reports as activity feed
      const [memosRes, invoicesRes, reportsRes] = await Promise.all([
        supabase
          .from('memos')
          .select('id, title, created_at, created_by')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('accounts_invoices')
          .select('id, invoice_number, vendor_name, created_at, created_by')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('ct_power_reports')
          .select('id, site_id, status, created_at, created_by')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const activities: ActivityItem[] = [];

      // Add memos
      if (memosRes.data) {
        memosRes.data.forEach(memo => {
          activities.push({
            id: memo.id,
            type: 'Memo',
            description: `New memo: ${memo.title}`,
            created_at: memo.created_at,
            user_id: memo.created_by,
          });
        });
      }

      // Add invoices
      if (invoicesRes.data) {
        invoicesRes.data.forEach(invoice => {
          activities.push({
            id: invoice.id,
            type: 'Invoice',
            description: `Invoice created for ${invoice.vendor_name}`,
            created_at: invoice.created_at,
            user_id: invoice.created_by,
          });
        });
      }

      // Add reports
      if (reportsRes.data) {
        reportsRes.data.forEach(report => {
          activities.push({
            id: report.id,
            type: 'Site Report',
            description: `Site report for ${report.site_id} - Status: ${report.status}`,
            created_at: report.created_at,
            user_id: report.created_by,
          });
        });
      }

      // Sort by created_at desc
      return activities.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 10);
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <Loader className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities && activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.type}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
