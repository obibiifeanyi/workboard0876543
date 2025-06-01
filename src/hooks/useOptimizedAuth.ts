
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

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
}

// Optimized authentication hook with caching and reduced database calls
export const useOptimizedAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const authStateCache = new Map();

    // Check cached profile first
    const getCachedProfile = (userId: string) => {
      const cached = authStateCache.get(userId);
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes cache
        return cached.profile;
      }
      return null;
    };

    const fetchProfile = async (userId: string): Promise<Profile> => {
      const cached = getCachedProfile(userId);
      if (cached) return cached;
      
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('id, role, account_type, full_name, email')
          .eq('id', userId)
          .single();

        if (!error && profileData) {
          const profile = profileData as Profile;
          authStateCache.set(userId, {
            profile,
            timestamp: Date.now()
          });
          return profile;
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
      }
      
      // Return default profile
      const defaultProfile: Profile = {
        id: userId,
        role: 'staff',
        account_type: 'staff',
        full_name: null,
        email: null,
      };
      
      authStateCache.set(userId, {
        profile: defaultProfile,
        timestamp: Date.now()
      });
      
      return defaultProfile;
    };

    // Set up optimized auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state change:', event);
      
      if (session?.user) {
        const userProfile = await fetchProfile(session.user.id);
        if (mounted) {
          setAuthState({
            user: session.user,
            profile: userProfile,
            session,
            loading: false,
          });
        }
      } else {
        if (mounted) {
          setAuthState({
            user: null,
            profile: null,
            session: null,
            loading: false,
          });
        }
        authStateCache.clear();
      }
    });

    // Check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session?.user) {
          if (mounted) {
            setAuthState(prev => ({ ...prev, loading: false }));
          }
          return;
        }

        const userProfile = await fetchProfile(session.user.id);
        if (mounted) {
          setAuthState({
            user: session.user,
            profile: userProfile,
            session,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Session fetch error:', error);
        if (mounted) {
          setAuthState(prev => ({ ...prev, loading: false }));
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
      
      setAuthState({
        user: null,
        profile: null,
        session: null,
        loading: false,
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    ...authState,
    signOut,
  };
};
