
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

    const getInitialSession = async () => {
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
          
          // Try to get profile data
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('id, role, account_type, full_name, email')
              .eq('id', session.user.id)
              .maybeSingle();

            if (mounted) {
              if (!profileError && profileData) {
                setProfile(profileData);
                localStorage.setItem('userRole', profileData.role || 'staff');
                localStorage.setItem('accountType', profileData.account_type || 'staff');
              } else {
                // Set defaults if profile not found
                const defaultProfile = {
                  id: session.user.id,
                  role: 'staff',
                  account_type: 'staff',
                  full_name: null,
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
              const defaultProfile = {
                id: session.user.id,
                role: 'staff',
                account_type: 'staff',
                full_name: null,
                email: session.user.email || null,
              };
              setProfile(defaultProfile);
              localStorage.setItem('userRole', 'staff');
              localStorage.setItem('accountType', 'staff');
            }
          }
        }
      } catch (error) {
        console.error('Initial session error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          
          // Don't fetch profile again if we already have it for this user
          if (profile?.id === session.user.id) {
            setLoading(false);
            return;
          }

          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('id, role, account_type, full_name, email')
              .eq('id', session.user.id)
              .maybeSingle();

            if (mounted) {
              if (!error && profileData) {
                setProfile(profileData);
                localStorage.setItem('userRole', profileData.role || 'staff');
                localStorage.setItem('accountType', profileData.account_type || 'staff');
              } else {
                const defaultProfile = {
                  id: session.user.id,
                  role: 'staff',
                  account_type: 'staff',
                  full_name: null,
                  email: session.user.email || null,
                };
                setProfile(defaultProfile);
                localStorage.setItem('userRole', 'staff');
                localStorage.setItem('accountType', 'staff');
              }
            }
          } catch (error) {
            console.error('Auth state profile error:', error);
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
      }
    );

    // Get initial session
    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
    profile,
    loading,
    signOut,
  };
};
