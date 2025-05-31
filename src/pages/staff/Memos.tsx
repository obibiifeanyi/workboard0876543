import { DashboardLayout } from "@/components/DashboardLayout";
import { SendMemoForm } from "@/components/memos/SendMemoForm";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Inbox, Mail, RefreshCw } from "lucide-react";

const Memos = () => {
  const [receivedMemos, setReceivedMemos] = useState([]);
  const [sentMemos, setSentMemos] = useState([]);
  const [departmentMemos, setDepartmentMemos] = useState([]);
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
        // Fetch received individual memos
        const { data: received, error: receivedError } = await supabase
          .from('user_memos')
          .select('*')
          .eq('recipient_id', user.id)
          .order('created_at', { ascending: false });

        if (!receivedError) {
          setReceivedMemos(received || []);
        }

        // Fetch sent individual memos
        const { data: sent, error: sentError } = await supabase
          .from('user_memos')
          .select('*')
          .eq('sender_id', user.id)
          .order('created_at', { ascending: false });

        if (!sentError) {
          setSentMemos(sent || []);
        }

        // Fetch department memos
        const { data: profile } = await supabase
          .from('profiles')
          .select('department')
          .eq('id', user.id)
          .single();

        if (profile?.department) {
          const { data: dept, error: deptError } = await supabase
            .from('memos')
            .select('*')
            .or(`department.eq.${profile.department},department.eq.all`)
            .eq('status', 'published')
            .order('created_at', { ascending: false });

          if (!deptError) {
            setDepartmentMemos(dept || []);
          }
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
      await supabase
        .from('user_memos')
        .update({ is_read: true })
        .eq('id', memoId);

      setReceivedMemos(prev => 
        prev.map(memo => 
          memo.id === memoId ? { ...memo, is_read: true } : memo
        )
      );
    } catch (error) {
      console.error('Error marking memo as read:', error);
    }
  };

  const ReceivedMemos = () => (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-primary" />
            Received Memos ({receivedMemos.length})
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchMemos}
            disabled={isLoading}
            className="rounded-[30px]"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {receivedMemos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No memos received yet.
          </div>
        ) : (
          <div className="space-y-4">
            {receivedMemos.map((memo) => (
              <div key={memo.id} className={`p-4 rounded-[30px] border ${!memo.is_read ? 'border-primary/50 bg-primary/5' : 'border-white/10 bg-white/5'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{memo.subject}</h4>
                      {!memo.is_read && (
                        <Badge className="bg-blue-100 text-blue-800 rounded-[30px]">New</Badge>
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
                      className="rounded-[30px]"
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const SentMemos = () => (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Sent Memos ({sentMemos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sentMemos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No memos sent yet.
          </div>
        ) : (
          <div className="space-y-4">
            {sentMemos.map((memo) => (
              <div key={memo.id} className="p-4 rounded-[30px] border border-white/10 bg-white/5">
                <h4 className="font-medium">{memo.subject}</h4>
                <p className="text-sm text-muted-foreground">{memo.content}</p>
                <p className="text-xs text-muted-foreground">
                  Sent on {new Date(memo.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const DepartmentMemos = () => (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Department Memos ({departmentMemos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {departmentMemos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No department memos available.
          </div>
        ) : (
          <div className="space-y-4">
            {departmentMemos.map((memo) => (
              <div key={memo.id} className="p-4 rounded-[30px] border border-white/10 bg-white/5">
                <h4 className="font-medium">{memo.title}</h4>
                <p className="text-sm text-muted-foreground">{memo.content}</p>
                <p className="text-xs text-muted-foreground">
                  Published on {new Date(memo.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout title="Memos">
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/5 dark:bg-white/5 rounded-[30px]">
            <TabsTrigger value="received" className="flex items-center gap-2 rounded-[30px]">
              <Inbox className="h-4 w-4" />
              Received
            </TabsTrigger>
            <TabsTrigger value="send" className="flex items-center gap-2 rounded-[30px]">
              <Mail className="h-4 w-4" />
              Send
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2 rounded-[30px]">
              <FileText className="h-4 w-4" />
              Sent
            </TabsTrigger>
            <TabsTrigger value="department" className="flex items-center gap-2 rounded-[30px]">
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
            <DepartmentMemos />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Memos;
