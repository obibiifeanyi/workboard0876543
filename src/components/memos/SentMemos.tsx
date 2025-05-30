
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserMemos } from "@/hooks/useUserMemos";
import { Send, User, Calendar } from "lucide-react";
import { format } from "date-fns";

export const SentMemos = () => {
  const { sentMemos, isLoadingSent } = useUserMemos();

  if (isLoadingSent) {
    return (
      <Card className="glass-card border border-primary/20">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">Loading sent memos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Send className="h-6 w-6" />
          Sent Memos ({sentMemos?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!sentMemos || sentMemos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No memos sent yet.
          </div>
        ) : (
          <div className="space-y-4">
            {sentMemos.map((memo) => (
              <div
                key={memo.id}
                className="p-4 rounded-lg border bg-muted/10 border-muted"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{memo.subject}</h3>
                    <Badge variant={memo.is_read ? "default" : "secondary"} className="text-xs">
                      {memo.is_read ? "Read" : "Unread"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(memo.created_at), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <User className="h-4 w-4" />
                  To: {memo.recipient_id}
                </div>
                
                <div className="text-sm whitespace-pre-wrap">
                  {memo.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
