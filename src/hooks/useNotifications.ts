
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  category: "general" | "memo" | "task" | "leave" | "document" | "system";
  priority: "low" | "normal" | "high" | "urgent";
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const fetchNotifications = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }

        if (mounted && data) {
          // Map database notifications to our interface, ensuring type safety
          const mappedNotifications: Notification[] = data.map(notification => ({
            id: notification.id,
            title: notification.title,
            message: notification.message,
            type: mapNotificationType(notification.type),
            category: mapNotificationCategory(notification.category),
            priority: mapNotificationPriority(notification.priority),
            is_read: notification.is_read,
            action_url: notification.action_url,
            created_at: notification.created_at,
          }));

          setNotifications(mappedNotifications);
          setUnreadCount(mappedNotifications.filter(n => !n.is_read).length);
        }
      } catch (error) {
        console.error('Notification fetch error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Helper functions to ensure type safety
    const mapNotificationType = (type: string): "info" | "success" | "warning" | "error" => {
      switch (type) {
        case 'success':
        case 'warning':
        case 'error':
        case 'info':
          return type;
        default:
          return 'info';
      }
    };

    const mapNotificationCategory = (category: string): "general" | "memo" | "task" | "leave" | "document" | "system" => {
      switch (category) {
        case 'memo':
        case 'task':
        case 'leave':
        case 'document':
        case 'system':
        case 'general':
          return category;
        default:
          return 'general';
      }
    };

    const mapNotificationPriority = (priority: string): "low" | "normal" | "high" | "urgent" => {
      switch (priority) {
        case 'low':
        case 'high':
        case 'urgent':
        case 'normal':
          return priority;
        default:
          return 'normal';
      }
    };

    fetchNotifications();

    // Set up real-time subscription
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          console.log('Real-time notification update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as any;
            const mappedNotification: Notification = {
              id: newNotification.id,
              title: newNotification.title,
              message: newNotification.message,
              type: mapNotificationType(newNotification.type),
              category: mapNotificationCategory(newNotification.category),
              priority: mapNotificationPriority(newNotification.priority),
              is_read: newNotification.is_read,
              action_url: newNotification.action_url,
              created_at: newNotification.created_at,
            };

            setNotifications(prev => [mappedNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show toast for new notification
            toast({
              title: mappedNotification.title,
              description: mappedNotification.message,
              variant: mappedNotification.type === 'error' ? 'destructive' : 'default',
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedNotification = payload.new as any;
            const mappedNotification: Notification = {
              id: updatedNotification.id,
              title: updatedNotification.title,
              message: updatedNotification.message,
              type: mapNotificationType(updatedNotification.type),
              category: mapNotificationCategory(updatedNotification.category),
              priority: mapNotificationPriority(updatedNotification.priority),
              is_read: updatedNotification.is_read,
              action_url: updatedNotification.action_url,
              created_at: updatedNotification.created_at,
            };

            setNotifications(prev => 
              prev.map(n => n.id === mappedNotification.id ? mappedNotification : n)
            );
            // Update unread count
            fetchNotifications();
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
            fetchNotifications();
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (!error) {
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.user.id)
        .eq('is_read', false);

      if (!error) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  };
};
