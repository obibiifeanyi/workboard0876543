import { useState, useEffect } from "react";
import { Bell, Mail, Calendar, Video, X, Check, AlertCircle } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "meeting";
  time: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EnhancedNotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching notifications
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "New Meeting Scheduled",
        message: "Team standup at 10:00 AM",
        type: "meeting",
        time: "5 minutes ago",
        read: false,
        action: {
          label: "Join Meeting",
          onClick: () => window.open("https://meet.google.com", "_blank"),
        },
      },
      {
        id: "2",
        title: "Task Completed",
        message: "Project X deployment successful",
        type: "success",
        time: "1 hour ago",
        read: false,
      },
      {
        id: "3",
        title: "System Update",
        message: "New features available",
        type: "info",
        time: "2 hours ago",
        read: true,
      },
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "meeting":
        return <Video className="h-5 w-5 text-blue-500" />;
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-background/10"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 animate-pulse-beacon"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[420px] overflow-hidden">
        <SheetHeader className="space-y-2">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4 pr-4">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 transition-all hover:shadow-md ${
                  notification.read
                    ? "opacity-70"
                    : "border-l-4 border-l-primary"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                      {notification.action && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            notification.action?.onClick();
                          }}
                        >
                          {notification.action.label}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};