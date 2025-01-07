import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/login/LoginForm";
import { PasswordChangeDialog } from "@/components/login/PasswordChangeDialog";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        const role = profile?.role || 'staff';
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
    };

    checkUser();
  }, [navigate]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();

        const role = profile?.role || 'staff';
        toast({
          title: "Login Successful",
          description: `Welcome back!`,
        });

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
    } catch (error: any) {
      const authError = error as AuthError;
      toast({
        title: "Login Failed",
        description: authError.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 animate-pulse-glow" />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      
      {/* Theme Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>
      
      <div className="w-full max-w-[400px] glass-card animate-scale-in relative z-10 
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
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default Login;