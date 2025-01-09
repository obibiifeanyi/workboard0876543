import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
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

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes("Invalid login credentials")) {
            return "Invalid email or password. Please check your credentials and try again.";
          }
          if (error.message.includes("Email not confirmed")) {
            return "Please verify your email address before signing in.";
          }
          return "Please enter valid email and password.";
        case 422:
          return "Invalid email format. Please enter a valid email address.";
        case 429:
          return "Too many login attempts. Please try again later.";
        default:
          return `Authentication error: ${error.message}`;
      }
    }
    return "An unexpected error occurred. Please try again.";
  };

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

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      await onLogin(email, password);

      const { error: notificationError } = await supabase.functions.invoke('send-notification', {
        body: {
          email,
          subject: 'New Login to AI Work-Board',
          content: `
            <h2>New Login Detected</h2>
            <p>A new login was detected for your account.</p>
            <p>Time: ${new Date().toLocaleString()}</p>
            <p>If this wasn't you, please contact support immediately.</p>
          `
        }
      });

      if (notificationError) {
        console.error('Failed to send login notification:', notificationError);
      }

    } catch (error: any) {
      console.error('Login error:', error);
      const authError = error as AuthError;
      const errorMessage = getErrorMessage(authError);
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
      if (error) throw error;

      toast({
        title: "Password Reset Link Sent",
        description: "Please check your email for further instructions",
      });
    } catch (error: any) {
      const authError = error as AuthError;
      setError(getErrorMessage(authError));
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
          placeholder="Enter your work email"
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