
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RememberMeCheckbox } from "./RememberMeCheckbox";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";
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
        
        // Fetch user profile to determine role-based routing
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, account_type')
          .eq('id', data.user.id)
          .single();

        if (!profileError && profile) {
          const role = profile.role || 'staff';
          const accountType = profile.account_type || 'staff';
          
          localStorage.setItem('userRole', role);
          localStorage.setItem('accountType', accountType);
        } else {
          // Default to staff if no profile found
          localStorage.setItem('userRole', 'staff');
          localStorage.setItem('accountType', 'staff');
        }

        toast({
          title: "Welcome Back!",
          description: "You have successfully logged in.",
        });
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4 rounded-[30px] border-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2 text-left">
        <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your work email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/10 dark:bg-black/10 border-primary/20 rounded-[30px] placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-primary/20"
          disabled={loading}
        />
      </div>
      <div className="space-y-2 text-left">
        <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your secure password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white/10 dark:bg-black/10 border-primary/20 rounded-[30px] placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-primary/20"
          disabled={loading}
        />
      </div>
      <div className="flex items-center justify-between">
        <RememberMeCheckbox
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked)}
          disabled={loading}
        />
        <ForgotPasswordDialog defaultEmail={email} />
      </div>
      <SubmitButton loading={loading} />
    </form>
  );
};
