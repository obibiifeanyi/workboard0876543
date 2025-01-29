import { useState } from "react";
import { Brain, Database, ChartBar, MessageSquare, Loader, Settings, Info, Check, X, AlertOctagon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
}

export const AIManagementSystem = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [learningProgress, setLearningProgress] = useState(0);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      isAI: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-and-notify', {
        body: { content: input, type: 'user_query' }
      });

      if (error) throw error;

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: data.result.result_data,
        isAI: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      
      toast({
        title: "Analysis Complete",
        description: "Managers and admins have been notified of the new analysis.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLearningProgress(0);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Learning Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-sm text-muted-foreground">Accuracy Rate</p>
          </CardContent>
        </Card>

        <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,816</div>
            <p className="text-sm text-muted-foreground">Entries Processed</p>
          </CardContent>
        </Card>

        <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBar className="h-5 w-5 text-primary" />
              Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>

        <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-sm text-muted-foreground">Total Conversations</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardHeader>
          <CardTitle>AI Chat Interface</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] flex flex-col gap-4">
            <div className="flex-1 overflow-y-auto space-y-4 pr-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isAI ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-xl backdrop-blur-lg ${
                      message.isAI
                        ? "bg-secondary/10 dark:bg-secondary/5"
                        : "bg-primary/10 dark:bg-primary/5"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs text-muted-foreground mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-4 p-4 bg-secondary/10 dark:bg-secondary/5 rounded-xl backdrop-blur-lg">
                  <Loader className="h-5 w-5 animate-spin" />
                  <p>CTNL AI is Thinking...</p>
                  <Progress value={learningProgress} className="w-[60%]" />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask CTNL AI something..."
                className="flex-1 bg-black/5 dark:bg-white/5 border-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};