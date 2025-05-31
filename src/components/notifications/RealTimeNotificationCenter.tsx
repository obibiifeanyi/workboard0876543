
import { Bell, Check, X, ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNotifications } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";

export const RealTimeNotificationCenter = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const getNotificationIcon = (type: string, category: string) => {
    if (type === "success") return <Check className="h-4 w-4 text-green-500" />;
    if (type === "error") return <X className="h-4 w-4 text-red-500" />;
    if (category === "memo") return <Bell className="h-4 w-4 text-blue-500" />;
    return <Bell className="h-4 w-4 text-gray-500" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "border-l-red-500 bg-red-50/50";
      case "high": return "border-l-orange-500 bg-orange-50/50";
      case "normal": return "border-l-blue-500 bg-blue-50/50";
      default: return "border-l-gray-500 bg-gray-50/50";
    }
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-background/10 rounded-[30px]"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-[30px]"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[420px] overflow-hidden">
        <SheetHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="rounded-[30px]"
              >
                Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4 pr-4">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md border-l-4 ${
                    notification.is_read ? "opacity-70" : ""
                  } ${getPriorityColor(notification.priority)}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type, notification.category)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{notification.title}</p>
                        {notification.action_url && (
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                        <Badge variant="outline" className="text-xs rounded-[30px]">
                          {notification.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
