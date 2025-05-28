
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
    queryKey: ['system_activities'],
    queryFn: async () => {
      // Try to get system activities first, fall back to notifications if table doesn't exist
      const { data: systemActivities, error: systemError } = await supabase
        .from('system_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!systemError && systemActivities) {
        return systemActivities.map(activity => ({
          id: activity.id,
          type: activity.type,
          description: activity.description,
          created_at: activity.created_at,
          user_id: activity.user_id,
        })) as ActivityItem[];
      }

      // Fallback to notifications
      const { data: notifications, error: notificationError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (notificationError) throw notificationError;
      
      return notifications?.map(notification => ({
        id: notification.id,
        type: notification.type,
        description: notification.message,
        created_at: notification.created_at,
        user_id: notification.user_id,
      })) as ActivityItem[] || [];
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
