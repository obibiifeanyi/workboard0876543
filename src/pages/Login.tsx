import { useState } from "react";
import { Brain } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/login/LoginForm";
import { PasswordChangeDialog } from "@/components/login/PasswordChangeDialog";
import { AIKnowledgeBase } from "@/components/ai/AIKnowledgeBase";

const Login = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);

  const handlePasswordChange = () => {
    setIsFirstLogin(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 animate-pulse-glow" />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      
      <div className="relative z-10 mb-8 text-center space-y-2 animate-fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          CTNL AI WORK-BOARD
        </h1>
        <p className="text-muted-foreground">
          Powered by Advanced AI Technology
        </p>
      </div>

      <Card className="w-full max-w-[400px] glass-card animate-scale-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Brain className="h-6 w-6 text-primary animate-pulse" />
            Login
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onFirstLogin={setIsFirstLogin} />
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setShowKnowledgeBase(true)}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Access AI Knowledge Base
            </Button>
          </div>
        </CardContent>
      </Card>

      <PasswordChangeDialog
        open={isFirstLogin}
        onOpenChange={setIsFirstLogin}
        onPasswordChange={handlePasswordChange}
      />

      <Dialog open={showKnowledgeBase} onOpenChange={setShowKnowledgeBase}>
        <DialogContent className="glass-card max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>AI Knowledge Base</DialogTitle>
            <DialogDescription>
              Upload documents to enhance AI learning capabilities
            </DialogDescription>
          </DialogHeader>
          <AIKnowledgeBase />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;