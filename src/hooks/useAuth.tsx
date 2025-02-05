import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError, User } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          // Fetch both profile and roles
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, account_type')
            .eq('id', session.user.id)
            .single();

          const { data: userRoles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id);

          if (profile?.role) {
            localStorage.setItem('userRole', profile.role);
            localStorage.setItem('accountType', profile.account_type || 'user');
          }

          if (userRoles) {
            localStorage.setItem('userRoles', JSON.stringify(userRoles.map(r => r.role)));
          }
        } else {
          setUser(null);
          localStorage.removeItem('userRole');
          localStorage.removeItem('userRoles');
          localStorage.removeItem('accountType');
        }
        setLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error fetching session:', error);
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      }
      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleError = (error: AuthError) => {
    console.error('Auth error:', error);
    toast({
      title: "Authentication Error",
      description: error.message,
      variant: "destructive",
    });
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      if (error instanceof Error) {
        handleError(error as AuthError);
      }
    }
  };

  return {
    user,
    loading,
    signOut,
  };
};