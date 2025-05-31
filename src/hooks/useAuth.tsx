
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
    let profileCache: Profile | null = null;

    // Check cached profile first
    const cachedRole = localStorage.getItem('userRole');
    const cachedAccountType = localStorage.getItem('accountType');
    
    const fetchProfile = async (userId: string) => {
      // Return cached profile if available
      if (profileCache) return profileCache;
      
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('id, role, account_type, full_name, email')
          .eq('id', userId)
          .single();

        if (!error && profileData) {
          profileCache = profileData;
          localStorage.setItem('userRole', profileData.role || 'staff');
          localStorage.setItem('accountType', profileData.account_type || 'staff');
          return profileData;
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
      }
      
      // Return default profile
      const defaultProfile = {
        id: userId,
        role: 'staff',
        account_type: 'staff',
        full_name: null,
        email: null,
      };
      profileCache = defaultProfile;
      localStorage.setItem('userRole', 'staff');
      localStorage.setItem('accountType', 'staff');
      return defaultProfile;
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state change:', event);
      
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Use cached data if available
        if (cachedRole && cachedAccountType && !profile) {
          const cachedProfile = {
            id: session.user.id,
            role: cachedRole,
            account_type: cachedAccountType,
            full_name: session.user.user_metadata?.full_name || null,
            email: session.user.email || null,
          };
          setProfile(cachedProfile);
          profileCache = cachedProfile;
        } else if (!profileCache) {
          // Only fetch if not cached
          const userProfile = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(userProfile);
          }
        }
      } else {
        setProfile(null);
        profileCache = null;
        localStorage.removeItem('userRole');
        localStorage.removeItem('accountType');
      }

      if (mounted) {
        setLoading(false);
      }
    });

    // Check for existing session - simplified
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session?.user) {
          if (mounted) setLoading(false);
          return;
        }

        // Use cached profile if available
        if (cachedRole && cachedAccountType) {
          const cachedProfile = {
            id: session.user.id,
            role: cachedRole,
            account_type: cachedAccountType,
            full_name: session.user.user_metadata?.full_name || null,
            email: session.user.email || null,
          };
          
          if (mounted) {
            setSession(session);
            setUser(session.user);
            setProfile(cachedProfile);
            profileCache = cachedProfile;
            setLoading(false);
          }
          return;
        }

        // Fetch profile only if not cached
        if (mounted) {
          setSession(session);
          setUser(session.user);
          
          const userProfile = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(userProfile);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Session fetch error:', error);
        if (mounted) setLoading(false);
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
      
      // Clear all cached data
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
