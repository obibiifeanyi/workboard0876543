import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "@/components/login/LoginForm";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoginHeader } from "@/components/login/LoginHeader";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);

  const redirectUserBasedOnRole = (role: string, accountType: string) => {
    console.log('Redirecting user based on role:', role, 'accountType:', accountType);
    
    // Redirect based on account type first, then role
    if (accountType === 'accountant') {
      navigate('/accountant');
    } else if (accountType === 'hr' || role === 'hr') {
      navigate('/hr');
    } else if (accountType === 'admin' || role === 'admin') {
      navigate('/admin');
    } else if (accountType === 'manager' || role === 'manager') {
      navigate('/manager');
    } else {
      // Default to staff for any other account type or role
      navigate('/staff');
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setIsChecking(false);
          return;
        }
        
        if (session?.user) {
          console.log('Existing session found, checking stored role...');
          const storedRole = localStorage.getItem('userRole') || 'staff';
          const storedAccountType = localStorage.getItem('accountType') || 'staff';
          
          // If we have stored role info, redirect immediately
          if (storedRole && storedAccountType) {
            redirectUserBasedOnRole(storedRole, storedAccountType);
          } else {
            // Otherwise fetch from database
            try {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role, account_type')
                .eq('id', session.user.id)
                .maybeSingle();

              if (profileError) {
                console.error('Error fetching profile:', profileError);
                navigate('/staff');
                return;
              }
              
              const role = profile?.role || 'staff';
              const accountType = profile?.account_type || 'staff';
              
              localStorage.setItem('userRole', role);
              localStorage.setItem('accountType', accountType);
              
              redirectUserBasedOnRole(role, accountType);
            } catch (profileError) {
              console.error('Profile fetch error:', profileError);
              navigate('/staff');
            }
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, fetching profile...');
        
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role, account_type')
            .eq('id', session.user.id)
            .maybeSingle();

          if (error) {
            console.error('Error fetching profile:', error);
            // Set default values if profile fetch fails
            localStorage.setItem('userRole', 'staff');
            localStorage.setItem('accountType', 'staff');
            navigate('/staff');
            return;
          }

          const role = profile?.role || 'staff';
          const accountType = profile?.account_type || 'staff';
          
          localStorage.setItem('userRole', role);
          localStorage.setItem('accountType', accountType);

          redirectUserBasedOnRole(role, accountType);

          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
        } catch (error) {
          console.error('Profile fetch error:', error);
          localStorage.setItem('userRole', 'staff');
          localStorage.setItem('accountType', 'staff');
          navigate('/staff');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleLogin = async (email: string, password: string) => {
    // Login handling is done in LoginForm component
    console.log('Login attempt for:', email);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 animate-pulse-glow" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        
        <div className="fixed top-4 right-4 z-50">
          <ThemeSwitcher />
        </div>
        
        <div className="w-full max-w-[400px] glass-card relative z-10 
          border border-white/10 dark:border-white/5 
          shadow-2xl hover:shadow-primary/5 transition-all duration-300
          bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-xl p-6">
          <img 
            src="/lovable-uploads/491c7e61-a4fb-46a3-a002-904b84354e48.png" 
            alt="CT Communication Towers Logo" 
            className="h-16 w-auto mx-auto mb-6"
          />
          <LoginHeader />
          <LoginForm onLogin={handleLogin} />
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Login;
