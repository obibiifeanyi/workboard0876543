import { useState } from "react";
import { Input } from "@/components/ui/input";
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
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, role, account_type')
          .eq('id', user.id)
          .single();

        if (profileError) {
          setError("Error fetching user profile");
          throw profileError;
        }

        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (rolesError) {
          console.error('Error fetching user roles:', rolesError);
        }

        const roles = userRoles?.map(r => r.role) || [profile?.role || 'staff'];
        localStorage.setItem('userRoles', JSON.stringify(roles));
        localStorage.setItem('userRole', profile?.role || 'staff');
        localStorage.setItem('accountType', profile?.account_type || accountType);

        toast({
          title: "Welcome Back!",
          description: "You have successfully logged in.",
        });

        if (roles.includes('admin')) {
          window.location.href = '/admin';
        } else if (roles.includes('accountant')) {
          window.location.href = '/accountant';
        } else if (roles.includes('manager')) {
          window.location.href = '/manager';
        } else {
          window.location.href = '/staff';
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

  return (
    <div className="w-full max-w-[400px] bg-gradient-to-b from-white to-[#F4F7FB] rounded-[40px] p-[25px_35px] border-[5px] border-white shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)]">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Select value={accountType} onValueChange={setAccountType}>
            <SelectTrigger className="w-full bg-white border-none shadow-[0_10px_10px_-5px_#cff0ff] rounded-[20px]">
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

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-white border-none p-[15px_20px] rounded-[20px] shadow-[0_10px_10px_-5px_#cff0ff] focus:border-[#ea384c] focus:border-x-2"
          disabled={loading}
        />

        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-white border-none p-[15px_20px] rounded-[20px] shadow-[0_10px_10px_-5px_#cff0ff] focus:border-[#ea384c] focus:border-x-2"
          disabled={loading}
        />

        <div className="flex items-center justify-between">
          <RememberMeCheckbox
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked)}
            disabled={loading}
          />
          <ForgotPasswordButton onClick={() => {}} disabled={loading} />
        </div>

        <SubmitButton loading={loading} />

        <div className="text-center mt-4">
          <a href="#" className="text-[9px] text-[#ea384c] hover:underline">
            Learn user licence agreement
          </a>
        </div>
      </form>
    </div>
  );
};