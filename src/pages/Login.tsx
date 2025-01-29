import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "@/components/login/LoginForm";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoginHeader } from "@/components/login/LoginHeader";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          const role = profile?.role || 'staff';
          localStorage.setItem('userRole', role);

          switch (role) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'manager':
              navigate('/manager/dashboard');
              break;
            default:
              navigate('/staff/dashboard');
          }
        }
      }
      if (event === 'SIGNED_OUT') {
        setError(null);
      }
    });

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/staff/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

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
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Login;