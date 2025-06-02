
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { NotificationService } from "@/services/notificationService";

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

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async (userId: string): Promise<Profile> => {
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('id, role, account_type, full_name, email')
          .eq('id', userId)
          .single();

        if (!error && profileData) {
          return profileData as Profile;
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
      }
      
      // Return default profile
      return {
        id: userId,
        role: 'staff',
        account_type: 'staff',
        full_name: null,
        email: null,
      };
    };

    // Set up auth state listener
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

          // Initialize notification service
          NotificationService.initialize(session.user.id);
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
        
        // Cleanup notification service
        NotificationService.cleanup();
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

          // Initialize notification service
          NotificationService.initialize(session.user.id);
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
      NotificationService.cleanup();
    };
  }, []);

  const signOut = async () => {
    try {
      NotificationService.cleanup();
      
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
