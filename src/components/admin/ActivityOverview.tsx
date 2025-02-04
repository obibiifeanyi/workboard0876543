
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, User, Building, Radio } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { SystemActivityRow } from "@/integrations/supabase/types/system";
import { useToast } from "@/hooks/use-toast";

export const ActivityOverview = () => {
  const { toast } = useToast();

  const { data: activities, isError } = useQuery<SystemActivityRow[]>({
    queryKey: ['admin-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }
      return data as SystemActivityRow[];
    },
    onError: (error) => {
      console.error('Query error:', error);
      toast({
        title: "Error",
        description: "Failed to load activities. Please try again later.",
        variant: "destructive",
      });
    },
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'department':
        return <Building className="h-4 w-4" />;
      case 'telecom':
        return <Radio className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-semibold">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {isError ? (
              <div className="p-4 text-sm text-muted-foreground">
                Unable to load activities. Please refresh the page.
              </div>
            ) : activities?.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                No recent activities found.
              </div>
            ) : (
              activities?.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-background/50 border border-border/50"
                >
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
