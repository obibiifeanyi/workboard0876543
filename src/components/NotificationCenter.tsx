import { Bell, AlertCircle, CheckCircle, Info } from "lucide-react";
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
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "leave" | "task" | "announcement" | "critical";
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Leave Request Approved",
    message: "John Doe's leave request has been approved",
    time: "5 minutes ago",
    type: "leave",
    read: false,
  },
  {
    id: "2",
    title: "Critical: System Update",
    message: "System maintenance scheduled for tonight",
    time: "1 hour ago",
    type: "critical",
    read: false,
  },
  {
    id: "3",
    title: "New Task Assignment",
    message: "Project X requires immediate attention",
    time: "2 hours ago",
    type: "task",
    read: true,
  },
  {
    id: "4",
    title: "Company Announcement",
    message: "All-hands meeting tomorrow at 10 AM",
    time: "3 hours ago",
    type: "announcement",
    read: true,
  },
];

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "leave":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "task":
        return <Bell className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Notifications</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.read 
                    ? "bg-background/50 border-border" 
                    : "bg-background border-primary"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};