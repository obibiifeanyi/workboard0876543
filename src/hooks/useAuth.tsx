
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          
          // Defer profile fetch to avoid blocking auth state change
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('role, account_type, full_name')
                .eq('id', session.user.id)
                .single();

              if (error) {
                console.error('Error fetching profile:', error);
                // Profile should exist due to trigger, but set defaults if not
                localStorage.setItem('userRole', 'staff');
                localStorage.setItem('accountType', 'staff');
                return;
              }

              if (profile) {
                console.log('Profile loaded:', profile);
                localStorage.setItem('userRole', profile.role || 'staff');
                localStorage.setItem('accountType', profile.account_type || 'staff');
              }
            } catch (error) {
              console.error('Error fetching profile:', error);
              localStorage.setItem('userRole', 'staff');
              localStorage.setItem('accountType', 'staff');
            }
          }, 0);
        } else {
          setUser(null);
          localStorage.removeItem('userRole');
          localStorage.removeItem('accountType');
        }
        setLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    user,
    loading,
    signOut,
  };
};
