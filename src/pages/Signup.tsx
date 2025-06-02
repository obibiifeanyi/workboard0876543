
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SignupForm } from "@/components/signup/SignupForm";
import { SignupHeader } from "@/components/signup/SignupHeader";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (
    email: string,
    password: string,
    profileData: {
      fullName: string;
      role: string;
      accountType: string;
      phone?: string;
      position?: string;
      department?: string;
      location?: string;
      bio?: string;
    }
  ) => {
    setError(null);
    
    try {
      console.log('Starting signup process with:', { email, profileData });
      
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: profileData.fullName.trim(),
            role: profileData.role,
            account_type: profileData.accountType,
            phone: profileData.phone?.trim() || null,
            position: profileData.position?.trim() || null,
            department: profileData.department?.trim() || null,
            location: profileData.location?.trim() || null,
            bio: profileData.bio?.trim() || null,
          },
        },
      });

      console.log('Signup response:', { data, signupError });

      if (signupError) {
        console.error('Signup error:', signupError);
        
        if (signupError.message.includes("User already registered") || 
            signupError.message.includes("Email address is already registered")) {
          toast({
            title: "Account Exists",
            description: "An account with this email already exists. Redirecting to login...",
            variant: "destructive",
          });
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        
        if (signupError.message.includes("Database error saving new user")) {
          setError("There was an issue creating your account. This might be due to a duplicate email or system error. Please try again or contact support.");
          return;
        }
        
        throw signupError;
      }

      if (data.user) {
        console.log('User created successfully:', data.user.id);
        
        // Store role and account type in localStorage for immediate use
        localStorage.setItem('userRole', profileData.role);
        localStorage.setItem('accountType', profileData.accountType);
        
        toast({
          title: "Account Created Successfully!",
          description: "Welcome to CT Communication Towers. Please check your email to verify your account.",
        });
        
        // Redirect based on role immediately after signup
        if (profileData.accountType === 'accountant') {
          navigate('/accountant');
        } else {
          switch (profileData.role) {
            case 'admin':
              navigate('/admin');
              break;
            case 'manager':
              navigate('/manager');
              break;
            default:
              navigate('/staff');
          }
        }
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      setError(errorMessage);
      
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 animate-pulse-glow" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        
        <div className="fixed top-4 right-4 z-50">
          <ThemeSwitcher />
        </div>
        
        <div className="w-full max-w-[600px] glass-card relative z-10 
          border border-white/10 dark:border-white/5 
          shadow-2xl hover:shadow-primary/5 transition-all duration-300
          bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-xl p-6">
          <img 
            src="/lovable-uploads/491c7e61-a4fb-46a3-a002-904b84354e48.png" 
            alt="CT Communication Towers Logo" 
            className="h-16 w-auto mx-auto mb-6"
          />
          <SignupHeader />
          <SignupForm onSignup={handleSignup} error={error} />
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Signup;
