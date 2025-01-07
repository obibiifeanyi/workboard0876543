import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Key } from "lucide-react";

export const LoginForm = ({ onFirstLogin }: { onFirstLogin: (value: boolean) => void }) => {
  const [email, setEmail] = useState(() => {
    return localStorage.getItem("rememberedEmail") || "";
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (email && password) {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        const mockFirstLogin = email.includes("new");
        
        if (mockFirstLogin) {
          onFirstLogin(true);
          setLoading(false);
          return;
        }

        let role = "staff";
        if (email.toLowerCase().includes("admin")) {
          role = "admin";
        } else if (email.toLowerCase().includes("manager")) {
          role = "manager";
        }

        localStorage.setItem("userRole", role);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${role}!`,
        });

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

  const handleForgotPassword = () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password Reset Link Sent",
      description: "Please check your email for further instructions",
    });
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-black/5 dark:bg-white/5 border-none placeholder:text-muted-foreground/50"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-black/5 dark:bg-white/5 border-none placeholder:text-muted-foreground/50"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="text-sm text-primary hover:text-primary/90 flex items-center gap-1"
          onClick={handleForgotPassword}
        >
          <Key className="h-3 w-3" />
          Forgot password?
        </Button>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90" 
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};