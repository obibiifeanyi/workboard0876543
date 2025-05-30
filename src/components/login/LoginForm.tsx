
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

      console.log('Attempting login with:', { email });

      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (authError) {
        console.error('Login error:', authError);
        
        if (authError.message === "Invalid login credentials") {
          setError("Invalid email or password. Please try again.");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Please check your email and confirm your account before signing in.");
        } else {
          setError(authError.message);
        }
        throw authError;
      }

      if (user) {
        console.log('User logged in successfully:', user.id);
        
        // Fetch user profile to get role and account_type
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, account_type, full_name')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            // Set default values if profile fetch fails
            localStorage.setItem('userRole', 'staff');
            localStorage.setItem('accountType', 'staff');
          } else if (profile) {
            console.log('Profile fetched:', profile);
            // Store role and account type from database
            localStorage.setItem('userRole', profile.role || 'staff');
            localStorage.setItem('accountType', profile.account_type || 'staff');
          }
        } catch (profileError) {
          console.error('Profile fetch error:', profileError);
          localStorage.setItem('userRole', 'staff');
          localStorage.setItem('accountType', 'staff');
        }

        toast({
          title: "Welcome Back!",
          description: "You have successfully logged in.",
        });

        // Navigation will be handled by the auth state change in Login.tsx
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof AuthError ? error.message : 'Failed to login';
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
