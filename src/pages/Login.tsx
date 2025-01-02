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
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
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

    // Here you would typically make an API call to change the password
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
      // Mock login - replace with actual authentication
      if (email && (password || isPasswordChanged)) {
        // Check if it's first login (mock check - replace with actual logic)
        const mockFirstLogin = !isPasswordChanged && email.includes("new");
        
        if (mockFirstLogin) {
          setIsFirstLogin(true);
          setLoading(false);
          return;
        }

        // Determine role based on email (mock logic)
        const role = email.includes("admin")
          ? "admin"
          : email.includes("manager")
          ? "manager"
          : "staff";

        toast({
          title: "Login Successful",
          description: `Welcome back, ${role}!`,
        });

        // Navigate based on role
        navigate(`/${role}/dashboard`);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">CTNL AI WORK-BOARD</h1>
        <p className="text-muted-foreground">Sign in to your account</p>
      </div>
      <Card className="w-full max-w-[400px]">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
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
                className="w-full"
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
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isFirstLogin} onOpenChange={setIsFirstLogin}>
        <DialogContent>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button 
              onClick={handlePasswordChange}
              className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90"
            >
              Change Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;