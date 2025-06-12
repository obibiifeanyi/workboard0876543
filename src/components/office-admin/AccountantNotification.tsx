import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BellRing, CheckCircle2, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AccountantNotification = () => {
  const queryClient = useQueryClient();
  const [readFilter, setReadFilter] = useState("all");

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredNotifications = notifications?.filter(notification =>
    readFilter === "all" || (readFilter === "read" ? notification.is_read : !notification.is_read)
  ) || [];

  const getReadColor = (isRead: boolean) => {
    return isRead ? "bg-gray-100 text-gray-800" : "bg-blue-100 text-blue-800";
  };

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAsUnreadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Accountant Notifications</h2>
      <div className="flex gap-2 mb-4">
        <Button variant={readFilter === "all" ? "default" : "outline"} onClick={() => setReadFilter("all")}>All</Button>
        <Button variant={readFilter === "read" ? "default" : "outline"} onClick={() => setReadFilter("read")}>Read</Button>
        <Button variant={readFilter === "unread" ? "default" : "outline"} onClick={() => setReadFilter("unread")}>Unread</Button>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Notifications</CardTitle>
          <Button><BellRing className="mr-2 h-4 w-4" /> Send New Notification</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Message</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.message}</TableCell>
                  <TableCell>{notification.type}</TableCell>
                  <TableCell>{notification.created_at ? new Date(notification.created_at).toLocaleDateString() : ''}</TableCell>
                  <TableCell>
                    <Badge className={getReadColor(notification.is_read)}>{notification.is_read ? "Read" : "Unread"}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {notification.is_read ? (
                      <Button variant="ghost" size="sm" onClick={() => markAsUnreadMutation.mutate(notification.id)}><XCircle className="h-4 w-4" /> Mark as Unread</Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => markAsReadMutation.mutate(notification.id)}><CheckCircle2 className="h-4 w-4" /> Mark as Read</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}; 