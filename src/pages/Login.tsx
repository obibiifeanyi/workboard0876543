import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "@/components/login/LoginForm";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoginHeader } from "@/components/login/LoginHeader";
import { AuthNavBar } from "@/components/navigation/AuthNavBar";

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

          // Redirect based on role
          switch (role) {
            case 'admin':
              navigate('/admin');
              break;
            case 'manager':
              navigate('/manager');
              break;
            case 'accountant':
              navigate('/accountant');
              break;
            default:
              navigate('/staff');
          }

          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
        }
      }
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('userRole');
        setError(null);
      }
    });

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const role = localStorage.getItem('userRole') || 'staff';
        switch (role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'manager':
            navigate('/manager');
            break;
          case 'accountant':
            navigate('/accountant');
            break;
          default:
            navigate('/staff');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleLogin = async (email: string, password: string, role: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Failed to login');
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : 'Failed to login',
        variant: "destructive",
      });
    }
  };

  return (
    <ErrorBoundary>
      <AuthNavBar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-[300px] bg-[#e8e8e8] dark:bg-gray-800 rounded-lg shadow-lg p-5">
          <LoginHeader />
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Login;