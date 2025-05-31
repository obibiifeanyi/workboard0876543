
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
    
    // Redirect based on account type first, then role
    if (accountType === 'accountant') {
      navigate('/accountant');
    } else if (accountType === 'admin' || role === 'admin') {
      navigate('/admin');
    } else if (accountType === 'manager' || role === 'manager') {
      navigate('/manager');
    } else {
      // Default to staff for any other account type or role
      navigate('/staff');
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          
          // Defer profile fetch to avoid blocking auth state change
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('id, role, account_type, full_name, email')
                .eq('id', session.user.id)
                .maybeSingle();

              if (error) {
                console.error('Error fetching profile:', error);
                // Profile should exist due to trigger, but set defaults if not
                const defaultRole = 'staff';
                const defaultAccountType = 'staff';
                setProfile({
                  id: session.user.id,
                  role: defaultRole,
                  account_type: defaultAccountType,
                  full_name: null,
                  email: session.user.email || null,
                });
                localStorage.setItem('userRole', defaultRole);
                localStorage.setItem('accountType', defaultAccountType);
                redirectUserBasedOnRole(defaultRole, defaultAccountType);
                return;
              }

              if (profileData) {
                console.log('Profile loaded:', profileData);
                const userRole = profileData.role || 'staff';
                const accountType = profileData.account_type || profileData.role || 'staff';
                
                setProfile(profileData);
                localStorage.setItem('userRole', userRole);
                localStorage.setItem('accountType', accountType);
                
                // Only redirect if user is not already on the correct dashboard
                const currentPath = window.location.pathname;
                const targetPath = accountType === 'accountant' ? '/accountant' : 
                                  userRole === 'admin' ? '/admin' :
                                  userRole === 'manager' ? '/manager' : '/staff';
                
                if (!currentPath.startsWith(targetPath)) {
                  redirectUserBasedOnRole(userRole, accountType);
                }
              }
            } catch (error) {
              console.error('Error fetching profile:', error);
              const defaultRole = 'staff';
              const defaultAccountType = 'staff';
              setProfile({
                id: session.user.id,
                role: defaultRole,
                account_type: defaultAccountType,
                full_name: null,
                email: session.user.email || null,
              });
              localStorage.setItem('userRole', defaultRole);
              localStorage.setItem('accountType', defaultAccountType);
              redirectUserBasedOnRole(defaultRole, defaultAccountType);
            }
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
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
    profile,
    loading,
    signOut,
  };
};
