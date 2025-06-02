
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export class NotificationService {
  private static channel: any = null;
  private static listeners: Map<string, (notification: any) => void> = new Map();

  static async initialize(userId: string) {
    if (this.channel) {
      this.cleanup();
    }

    // Subscribe to real-time notifications
    this.channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('New notification received:', payload);
          this.handleNewNotification(payload.new);
        }
      )
      .subscribe();

    console.log('Notification service initialized for user:', userId);
  }

  static cleanup() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.listeners.clear();
  }

  private static handleNewNotification(notification: any) {
    // Show toast notification
    toast.info(notification.title, {
      description: notification.message,
      duration: 5000,
    });

    // Notify all listeners
    this.listeners.forEach(callback => callback(notification));
  }

  static addListener(key: string, callback: (notification: any) => void) {
    this.listeners.set(key, callback);
  }

  static removeListener(key: string) {
    this.listeners.delete(key);
  }

  static async sendNotification(notification: {
    user_id: string;
    title: string;
    message: string;
    type?: string;
    metadata?: any;
  }) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Send notification error:', error);
      return { success: false, error: error.message };
    }
  }
}
