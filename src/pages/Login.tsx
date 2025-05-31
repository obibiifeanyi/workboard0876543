
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
    
    if (accountType === 'accountant') {
      navigate('/accountant');
    } else if (accountType === 'hr' || role === 'hr') {
      navigate('/hr');
    } else if (accountType === 'admin' || role === 'admin') {
      navigate('/admin');
    } else if (accountType === 'manager' || role === 'manager') {
      navigate('/manager');
    } else {
      navigate('/staff');
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          if (mounted) {
            setIsChecking(false);
          }
          return;
        }
        
        if (session?.user && mounted) {
          console.log('Existing session found');
          
          // Check stored credentials first for faster redirect
          const storedRole = localStorage.getItem('userRole');
          const storedAccountType = localStorage.getItem('accountType');
          
          if (storedRole && storedAccountType) {
            redirectUserBasedOnRole(storedRole, storedAccountType);
            return;
          }

          // Fetch from database if not stored
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role, account_type')
              .eq('id', session.user.id)
              .maybeSingle();

            if (!profileError && profile && mounted) {
              const role = profile.role || 'staff';
              const accountType = profile.account_type || 'staff';
              
              localStorage.setItem('userRole', role);
              localStorage.setItem('accountType', accountType);
              
              redirectUserBasedOnRole(role, accountType);
            } else if (mounted) {
              navigate('/staff');
            }
          } catch (profileError) {
            console.error('Profile fetch error:', profileError);
            if (mounted) {
              navigate('/staff');
            }
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        if (mounted) {
          setIsChecking(false);
        }
      }
    };

    // Set timeout to prevent infinite checking
    const checkTimeout = setTimeout(() => {
      if (mounted) {
        setIsChecking(false);
      }
    }, 3000);

    checkSession();

    // Set up auth state listener for new sign-ins
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Login page auth state change:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, fetching profile...');
        
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role, account_type')
            .eq('id', session.user.id)
            .maybeSingle();

          if (!error && profile && mounted) {
            const role = profile.role || 'staff';
            const accountType = profile.account_type || 'staff';
            
            localStorage.setItem('userRole', role);
            localStorage.setItem('accountType', accountType);

            redirectUserBasedOnRole(role, accountType);

            toast({
              title: "Welcome back!",
              description: "You have successfully logged in.",
            });
          } else if (mounted) {
            localStorage.setItem('userRole', 'staff');
            localStorage.setItem('accountType', 'staff');
            navigate('/staff');
          }
        } catch (error) {
          console.error('Profile fetch error:', error);
          if (mounted) {
            localStorage.setItem('userRole', 'staff');
            localStorage.setItem('accountType', 'staff');
            navigate('/staff');
          }
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(checkTimeout);
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleLogin = async (email: string, password: string) => {
    console.log('Login attempt for:', email);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Checking authentication...</p>
        </div>
      );
    }
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
