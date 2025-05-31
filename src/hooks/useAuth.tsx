
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  role: string;
  account_type: string;
  full_name: string | null;
  email: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          setUser(session.user);
          
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('id, role, account_type, full_name, email')
              .eq('id', session.user.id)
              .single();

            if (mounted) {
              if (!profileError && profileData) {
                setProfile(profileData);
                localStorage.setItem('userRole', profileData.role || 'staff');
                localStorage.setItem('accountType', profileData.account_type || 'staff');
              } else {
                console.error('Profile error:', profileError);
                // Create default profile if none exists
                const defaultProfile = {
                  id: session.user.id,
                  role: 'staff',
                  account_type: 'staff',
                  full_name: session.user.user_metadata?.full_name || null,
                  email: session.user.email || null,
                };
                setProfile(defaultProfile);
                localStorage.setItem('userRole', 'staff');
                localStorage.setItem('accountType', 'staff');
              }
            }
          } catch (error) {
            console.error('Profile fetch error:', error);
            if (mounted) {
              // Set default profile on error
              const defaultProfile = {
                id: session.user.id,
                role: 'staff',
                account_type: 'staff',
                full_name: session.user.user_metadata?.full_name || null,
                email: session.user.email || null,
              };
              setProfile(defaultProfile);
              localStorage.setItem('userRole', 'staff');
              localStorage.setItem('accountType', 'staff');
            }
          }
        } else if (mounted) {
          setUser(null);
          setProfile(null);
          localStorage.removeItem('userRole');
          localStorage.removeItem('accountType');
        }
      } catch (error) {
        console.error('Session fetch error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted) {
        console.log('Auth timeout reached, stopping loading');
        setLoading(false);
      }
    }, 5000);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state change:', event);
      
      if (session?.user) {
        setUser(session.user);
        
        // Fetch profile for the user
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, role, account_type, full_name, email')
            .eq('id', session.user.id)
            .single();

          if (!profileError && profileData) {
            setProfile(profileData);
            localStorage.setItem('userRole', profileData.role || 'staff');
            localStorage.setItem('accountType', profileData.account_type || 'staff');
          } else {
            // Create default profile
            const defaultProfile = {
              id: session.user.id,
              role: 'staff',
              account_type: 'staff',
              full_name: session.user.user_metadata?.full_name || null,
              email: session.user.email || null,
            };
            setProfile(defaultProfile);
            localStorage.setItem('userRole', 'staff');
            localStorage.setItem('accountType', 'staff');
          }
        } catch (error) {
          console.error('Profile fetch error in auth state change:', error);
        }
      } else {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('userRole');
        localStorage.removeItem('accountType');
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    getSession();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local storage
      localStorage.removeItem('userRole');
      localStorage.removeItem('accountType');
      localStorage.removeItem('rememberedEmail');
      
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    user,
    profile,
    loading,
    signOut,
  };
};
