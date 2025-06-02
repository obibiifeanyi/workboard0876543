
import { useState, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useApi";
import { ApiService } from "@/services/api";
import { NotificationService } from "@/services/notificationService";
import { toast } from "sonner";

export const NotificationCenter = () => {
  const { user } = useAuth();
  const { data: notifications, loading, refetch } = useNotifications(user?.id || '');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (notifications) {
      const unread = notifications.filter((n: any) => !n.is_read).length;
      setUnreadCount(unread);
    }
  }, [notifications]);

  useEffect(() => {
    if (user) {
      // Listen for new notifications
      NotificationService.addListener('notification-center', () => {
        refetch();
        toast.info('New notification received');
      });

      return () => {
        NotificationService.removeListener('notification-center');
      };
    }
  }, [user, refetch]);

  const markAsRead = async (notificationId: string) => {
    const result = await ApiService.markNotificationAsRead(notificationId);
    if (result.success) {
      refetch();
    }
  };

  const markAllAsRead = async () => {
    if (notifications) {
      const unreadNotifications = notifications.filter((n: any) => !n.is_read);
      const promises = unreadNotifications.map((n: any) => 
        ApiService.markNotificationAsRead(n.id)
      );
      
      await Promise.all(promises);
      refetch();
      toast.success('All notifications marked as read');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'memo': return '📧';
      case 'task': return '✅';
      case 'meeting': return '📅';
      case 'report': return '📊';
      case 'leave': return '🏖️';
      default: return '🔔';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading notifications...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {!notifications || notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification: any) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border transition-colors ${
                  notification.is_read 
                    ? 'bg-muted/30 border-muted' 
                    : 'bg-background border-primary/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-lg">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium ${
                        notification.is_read ? 'text-muted-foreground' : 'text-foreground'
                      }`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        notification.is_read ? 'text-muted-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification.message}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(notification.created_at)}
                      </span>
                    </div>
                  </div>
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
