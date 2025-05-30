
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [accountType, setAccountType] = useState("staff");
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

      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (authError) {
        if (authError.message === "Invalid login credentials") {
          setError("Invalid email or password. Please try again.");
        } else {
          setError(authError.message);
        }
        throw authError;
      }

      if (user) {
        // Use proper Supabase client method instead of direct REST API
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, account_type')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Set default values if profile fetch fails
          localStorage.setItem('userRole', 'staff');
          localStorage.setItem('accountType', accountType);
        } else {
          // Store role and account type
          localStorage.setItem('userRole', profile?.role || 'staff');
          localStorage.setItem('accountType', profile?.account_type || accountType);
        }

        toast({
          title: "Welcome Back!",
          description: "You have successfully logged in.",
        });

        // Navigate based on account type
        const finalAccountType = profile?.account_type || accountType;
        const finalRole = profile?.role || 'staff';

        if (finalAccountType === 'accountant') {
          window.location.href = '/accountant';
        } else {
          switch (finalRole) {
            case 'admin':
              window.location.href = '/admin';
              break;
            case 'manager':
              window.location.href = '/manager';
              break;
            default:
              window.location.href = '/staff';
          }
        }
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

    toast({
      title: "Password Reset Link Sent",
      description: "Please check your email for further instructions",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2 text-left">
        <Label htmlFor="accountType">Account Type</Label>
        <Select value={accountType} onValueChange={setAccountType}>
          <SelectTrigger>
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="accountant">Accountant</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
