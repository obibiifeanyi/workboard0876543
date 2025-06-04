import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Reset success state after delay
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (isSuccess) {
      timeoutId = setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSuccess]);

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!email.trim()) {
      errors.push("Email address is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push("Please enter a valid email address");
    }
    
    if (!password) {
      errors.push("Password is required");
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);
    setIsSubmitting(true);

    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        toast({
          title: "Validation Error",
          description: "Please fix the errors in the form",
          variant: "destructive",
        });
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
        
        setValidationErrors([errorMessage]);
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

        setIsSuccess(true);
        toast({
          title: "Welcome Back!",
          description: "You have successfully logged in.",
        });
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setValidationErrors([errorMessage]);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-[30px] mb-4 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
            <span className="font-medium">Please fix the following errors:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-2">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Success message */}
      {isSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-3 rounded-[30px] mb-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
            <span>Login successful! Redirecting...</span>
          </div>
        </div>
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </div>
      <div className="flex items-center justify-between">
        <RememberMeCheckbox
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked)}
          disabled={isSubmitting}
        />
        <ForgotPasswordDialog defaultEmail={email} />
      </div>
      <SubmitButton loading={isSubmitting} />
    </form>
  );
};
