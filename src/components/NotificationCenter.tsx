import { Bell } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Leave Request",
    message: "New leave request from John Doe",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: "2",
    title: "Project Update",
    message: "Site maintenance completed for Tower A",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "Task Assignment",
    message: "You have been assigned to Project X",
    time: "2 hours ago",
    read: true,
  },
];

export const NotificationCenter = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-emerald hover:bg-emerald/10">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-emerald animate-pulse" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gradient-dark border-white/10">
        <SheetHeader>
          <SheetTitle className="text-white">Notifications</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <div className="space-y-4">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border border-white/10 ${
                  notification.read ? "bg-black/20" : "bg-gradient-card"
                }`}
              >
                <h4 className="font-semibold text-white">{notification.title}</h4>
                <p className="text-sm text-white/70">
                  {notification.message}
                </p>
                <span className="text-xs text-white/50">
                  {notification.time}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};