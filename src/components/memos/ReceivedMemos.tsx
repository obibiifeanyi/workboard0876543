
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserMemos } from "@/hooks/useUserMemos";
import { Inbox, User, Calendar, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export const ReceivedMemos = () => {
  const { receivedMemos, markAsRead, isLoadingReceived } = useUserMemos();

  const handleMarkAsRead = (memoId: string) => {
    markAsRead.mutate(memoId);
  };

  if (isLoadingReceived) {
    return (
      <Card className="glass-card border border-primary/20">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">Loading memos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Inbox className="h-6 w-6" />
          Received Memos ({receivedMemos?.filter(memo => !memo.is_read).length || 0} unread)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!receivedMemos || receivedMemos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No memos received yet.
          </div>
        ) : (
          <div className="space-y-4">
            {receivedMemos.map((memo) => (
              <div
                key={memo.id}
                className={`p-4 rounded-lg border ${
                  memo.is_read 
                    ? 'bg-muted/20 border-muted' 
                    : 'bg-primary/5 border-primary/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{memo.subject}</h3>
                    {!memo.is_read && (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(memo.created_at), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <User className="h-4 w-4" />
                  From: {memo.sender_id}
                </div>
                
                <div className="text-sm mb-3 whitespace-pre-wrap">
                  {memo.content}
                </div>
                
                {!memo.is_read && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkAsRead(memo.id)}
                    className="mt-2"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Read
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
