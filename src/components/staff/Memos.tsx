
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SendMemoForm } from "@/components/memos/SendMemoForm";
import { MemoGeneration } from "./MemoGeneration";
import { FileText, Send, Inbox, Mail, RefreshCw } from "lucide-react";

export const Memos = () => {
  const [receivedMemos, setReceivedMemos] = useState([]);
  const [sentMemos, setSentMemos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMemos();
  }, []);

  const fetchMemos = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch received memos
        const { data: received, error: receivedError } = await supabase
          .from('user_memos')
          .select('*')
          .eq('recipient_id', user.id)
          .order('created_at', { ascending: false });

        if (receivedError) {
          console.error('Error fetching received memos:', receivedError);
        } else {
          setReceivedMemos(received || []);
        }

        // Fetch sent memos
        const { data: sent, error: sentError } = await supabase
          .from('user_memos')
          .select('*')
          .eq('sender_id', user.id)
          .order('created_at', { ascending: false });

        if (sentError) {
          console.error('Error fetching sent memos:', sentError);
        } else {
          setSentMemos(sent || []);
        }
      }
    } catch (error) {
      console.error('Error fetching memos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch memos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (memoId: string) => {
    try {
      const { error } = await supabase
        .from('user_memos')
        .update({ is_read: true })
        .eq('id', memoId);

      if (error) {
        console.error('Error marking memo as read:', error);
      } else {
        setReceivedMemos(prev => 
          prev.map(memo => 
            memo.id === memoId ? { ...memo, is_read: true } : memo
          )
        );
      }
    } catch (error) {
      console.error('Error marking memo as read:', error);
    }
  };

  const ReceivedMemos = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Received Memos ({receivedMemos.length})
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchMemos}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {receivedMemos.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No memos received yet.</p>
          </CardContent>
        </Card>
      ) : (
        receivedMemos.map((memo) => (
          <Card key={memo.id} className={`${!memo.is_read ? 'border-primary/50 bg-primary/5' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{memo.subject}</h4>
                    {!memo.is_read && (
                      <Badge className="bg-blue-100 text-blue-800">New</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {memo.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(memo.created_at).toLocaleString()}
                  </p>
                </div>
                {!memo.is_read && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => markAsRead(memo.id)}
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const SentMemos = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Sent Memos ({sentMemos.length})</h3>
      
      {sentMemos.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No memos sent yet.</p>
          </CardContent>
        </Card>
      ) : (
        sentMemos.map((memo) => (
          <Card key={memo.id}>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">{memo.subject}</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {memo.content}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{new Date(memo.created_at).toLocaleString()}</span>
                <Badge variant={memo.is_read ? "default" : "secondary"}>
                  {memo.is_read ? "Read" : "Unread"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Memos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="received" className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              Received
            </TabsTrigger>
            <TabsTrigger value="send" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Sent
            </TabsTrigger>
            <TabsTrigger value="department" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Department
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="received" className="mt-6">
            <ReceivedMemos />
          </TabsContent>
          
          <TabsContent value="send" className="mt-6">
            <SendMemoForm onMemoSent={fetchMemos} />
          </TabsContent>
          
          <TabsContent value="sent" className="mt-6">
            <SentMemos />
          </TabsContent>
          
          <TabsContent value="department" className="mt-6">
            <MemoGeneration />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
