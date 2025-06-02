
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          // Redirect to login after a delay
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (data.session) {
          console.log('Auth callback successful, redirecting...');
          
          // Fetch user profile to determine role-based routing
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, account_type')
            .eq('id', data.session.user.id)
            .single();

          if (!profileError && profile) {
            const role = profile.role || 'staff';
            const accountType = profile.account_type || 'staff';
            
            localStorage.setItem('userRole', role);
            localStorage.setItem('accountType', accountType);

            // Redirect based on role
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
          } else {
            // Default to staff dashboard
            navigate('/staff');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        setError('An unexpected error occurred during authentication');
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-lg">Authentication Error</div>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Processing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
