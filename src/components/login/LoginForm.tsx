import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = ({ onFirstLogin }: { onFirstLogin: (value: boolean) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (email && password) {
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