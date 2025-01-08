import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

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

  const handleError = (error: AuthError) => {
    console.error('Auth error:', error);
    setError(error.message);
    toast({
      title: "Authentication Error",
      description: error.message,
      variant: "destructive",
    });
  };

  return (
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
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            AI Work-Board
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your dashboard
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: 'dark',
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--primary))',
                  brandAccent: 'rgb(var(--primary))',
                },
              },
            },
          }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Login;