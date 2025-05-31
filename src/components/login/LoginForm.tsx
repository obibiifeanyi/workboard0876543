
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RememberMeCheckbox } from "./RememberMeCheckbox";
import { ForgotPasswordButton } from "./ForgotPasswordButton";
import { SubmitButton } from "./SubmitButton";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState(() => {
    return localStorage.getItem("rememberedEmail") || "";
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Please enter both email and password");
        setLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      console.log('Attempting login with email:', email);

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (authError) {
        console.error('Login error:', authError);
        
        let errorMessage = "Login failed. Please try again.";
        
        if (authError.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (authError.message.includes("Email not confirmed")) {
          errorMessage = "Please check your email and confirm your account before signing in.";
        } else if (authError.message.includes("Too many requests")) {
          errorMessage = "Too many login attempts. Please wait a moment and try again.";
        } else {
          errorMessage = authError.message;
        }
        
        setError(errorMessage);
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.id);
        toast({
          title: "Welcome Back!",
          description: "You have successfully logged in.",
        });
        // Navigation will be handled by the auth state change listener
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        setError(error.message);
      } else {
        toast({
          title: "Password Reset Link Sent",
          description: "Please check your email for further instructions",
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError("Failed to send password reset email");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2 text-left">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-black/5 dark:bg-white/5 border-none placeholder:text-muted-foreground/50"
          disabled={loading}
        />
      </div>
      <div className="space-y-2 text-left">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-black/5 dark:bg-white/5 border-none placeholder:text-muted-foreground/50"
          disabled={loading}
        />
      </div>
      <div className="flex items-center justify-between">
        <RememberMeCheckbox
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked)}
          disabled={loading}
        />
        <ForgotPasswordButton
          onClick={handleForgotPassword}
          disabled={loading}
        />
      </div>
      <SubmitButton loading={loading} />
    </form>
  );
};
