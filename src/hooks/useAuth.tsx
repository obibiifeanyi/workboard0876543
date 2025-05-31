
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

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
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state change:', event, session?.user?.id);
      
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch user profile
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, role, account_type, full_name, email')
            .eq('id', session.user.id)
            .single();

          if (!profileError && profileData && mounted) {
            setProfile(profileData);
            localStorage.setItem('userRole', profileData.role || 'staff');
            localStorage.setItem('accountType', profileData.account_type || 'staff');
          } else {
            console.error('Profile fetch error:', profileError);
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
        } catch (error) {
          console.error('Profile fetch error:', error);
          if (mounted) {
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
      } else {
        setProfile(null);
        localStorage.removeItem('userRole');
        localStorage.removeItem('accountType');
      }

      if (mounted) {
        setLoading(false);
      }
    });

    // Check for existing session
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
          setSession(session);
          setUser(session.user);
          
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('id, role, account_type, full_name, email')
              .eq('id', session.user.id)
              .single();

            if (!profileError && profileData && mounted) {
              setProfile(profileData);
              localStorage.setItem('userRole', profileData.role || 'staff');
              localStorage.setItem('accountType', profileData.account_type || 'staff');
            } else {
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
            console.error('Profile fetch error:', error);
            if (mounted) {
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
        }
      } catch (error) {
        console.error('Session fetch error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

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
      
      // Clear local storage
      localStorage.removeItem('userRole');
      localStorage.removeItem('accountType');
      localStorage.removeItem('rememberedEmail');
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    user,
    profile,
    session,
    loading,
    signOut,
  };
};
