import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AIKnowledgeBase } from "@/components/ai/AIKnowledgeBase";
import { Brain } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Password changed successfully",
    });
    setIsFirstLogin(false);
    handleLogin(null, true);
  };

  const handleLogin = async (e?: React.FormEvent, isPasswordChanged = false) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      if (email && (password || isPasswordChanged)) {
        const mockFirstLogin = !isPasswordChanged && email.includes("new");
        
        if (mockFirstLogin) {
          setIsFirstLogin(true);
          setLoading(false);
          return;
        }

        // Determine role based on email (mock logic)
        let role = "staff";
        if (email.toLowerCase().includes("admin")) {
          role = "admin";
        } else if (email.toLowerCase().includes("manager")) {
          role = "manager";
        }

        // Store role in localStorage
        localStorage.setItem("userRole", role);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${role}!`,
        });

        // Navigate based on role
        switch (role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "manager":
            navigate("/manager/dashboard");
            break;
          default:
            navigate("/staff/dashboard");
        }
      } else {
        toast({
          title: "Error",
          description: "Please enter both email and password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/5 dark:bg-white/5 border-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/5 dark:bg-white/5 border-none"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

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

      <Dialog open={isFirstLogin} onOpenChange={setIsFirstLogin}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Since this is your first login, please change your password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-black/5 dark:bg-white/5 border-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-black/5 dark:bg-white/5 border-none"
              />
            </div>
            <Button 
              onClick={handlePasswordChange}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Change Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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