import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Minimize2, Maximize2, Brain, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [learningProgress, setLearningProgress] = useState(0);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      content: input,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    // Simulate AI learning progress
    const interval = setInterval(() => {
      setLearningProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate AI response with enhanced features
    setTimeout(() => {
      const aiResponse = {
        content: "I've analyzed the data and here's my response based on the system's knowledge base...",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);
      setLearningProgress(0);
      clearInterval(interval);

      toast({
        title: "AI Response Ready",
        description: "The AI has processed your request using the knowledge base",
        duration: 3000,
      });
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className={`fixed bottom-4 right-4 w-96 transition-all duration-300 ease-in-out glass-card ${
      isMinimized ? 'h-12' : 'h-[600px]'
    }`}>
      <CardHeader className="p-3 flex flex-row items-center justify-between border-b border-white/10">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary animate-pulse" />
          CTNL AI Assistant
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-white/10"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>
      </CardHeader>
      {!isMinimized && (
        <CardContent className="p-3 space-y-3">
          <ScrollArea className="h-[480px] w-full pr-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`chat-message ${
                      msg.isUser
                        ? 'bg-primary/10 ml-12'
                        : 'bg-secondary/10 mr-12'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs text-muted-foreground mt-2 block">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="ai-thinking">
                  <Loader className="h-5 w-5 animate-spin" />
                  <div className="flex-1">
                    <p className="text-sm mb-2">CTNL AI is Thinking...</p>
                    <Progress value={learningProgress} className="h-1" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask CTNL AI anything..."
              className="flex-1 bg-white/5 border-white/10"
            />
            <Button 
              size="icon" 
              onClick={handleSend}
              disabled={isThinking}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};