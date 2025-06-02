
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Key, Loader2, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Check if we have the required parameters
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        
        if (!accessToken || !refreshToken) {
          setError("Invalid or missing reset token. Please request a new password reset link.");
          setValidatingToken(false);
          return;
        }

        // Set the session with the tokens from the URL
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setError("Invalid or expired reset token. Please request a new password reset link.");
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setError("An error occurred while validating the reset token.");
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setSuccess(true);
        toast({
          title: "Success",
          description: "Your password has been updated successfully!",
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Password update error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update password";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Validating reset token...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 animate-pulse-glow" />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>
      
      <div className="w-full max-w-[400px] relative z-10">
        <img 
          src="/lovable-uploads/491c7e61-a4fb-46a3-a002-904b84354e48.png" 
          alt="CT Communication Towers Logo" 
          className="h-16 w-auto mx-auto mb-6"
        />
        
        <Card className="glass-card border border-primary/20 dark:border-primary/10 
          shadow-2xl hover:shadow-primary/10 transition-all duration-300
          bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-[30px]">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              <Key className="h-6 w-6" />
              Reset Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-green-600">Password Updated!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your password has been successfully updated. You will be redirected to the login page shortly.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="rounded-[30px]">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2 text-left">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/10 dark:bg-black/10 border-primary/20 rounded-[30px] placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-primary/20"
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2 text-left">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-white/10 dark:bg-black/10 border-primary/20 rounded-[30px] placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-primary/20"
                    disabled={loading}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 rounded-[30px]" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
