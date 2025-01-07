import { useState } from "react";
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
import { LoginForm } from "@/components/login/LoginForm";
import { PasswordChangeDialog } from "@/components/login/PasswordChangeDialog";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const Login = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const handlePasswordChange = () => {
    setIsFirstLogin(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 animate-pulse-glow" />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      
      {/* Theme Switcher positioned at top-right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>
      
      <Card className="w-full max-w-[400px] glass-card animate-scale-in relative z-10 
        border border-white/10 dark:border-white/5 
        shadow-2xl hover:shadow-primary/5 transition-all duration-300
        bg-white/10 dark:bg-black/20 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Login
          </CardTitle>
          <CardDescription className="text-foreground/70">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onFirstLogin={setIsFirstLogin} />
        </CardContent>
      </Card>

      <PasswordChangeDialog
        open={isFirstLogin}
        onOpenChange={setIsFirstLogin}
        onPasswordChange={handlePasswordChange}
      />
    </div>
  );
};

export default Login;