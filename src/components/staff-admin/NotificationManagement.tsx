import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BellRing, Trash2, CheckCircle2 } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  type: string;
  date: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    message: "New user registered: John Doe",
    type: "System",
    date: "2024-06-12 10:00",
    read: false,
  },
  {
    id: "2",
    message: "Project 'Alpha' is overdue.",
    type: "Alert",
    date: "2024-06-11 15:30",
    read: true,
  },
  {
    id: "3",
    message: "Weekly system backup completed successfully.",
    type: "Info",
    date: "2024-06-11 02:00",
    read: true,
  },
];

export const NotificationManagement = () => {
  const getStatusColor = (read: boolean) => {
    return read ? "bg-gray-100 text-gray-800" : "bg-blue-100 text-blue-800 font-semibold";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Notification Management</h2>
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
              {mockNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.message}</TableCell>
                  <TableCell>{notification.type}</TableCell>
                  <TableCell>{notification.date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(notification.read)}>{notification.read ? "Read" : "Unread"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {!notification.read && (
                      <Button variant="ghost" size="sm" className="mr-2"><CheckCircle2 className="h-4 w-4" /> Mark as Read</Button>
                    )}
                    <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /> Delete</Button>
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