
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  userRole?: string;
}

export const RoleBasedRoute = ({ children, allowedRoles, userRole: propUserRole }: RoleBasedRouteProps) => {
  const { toast } = useToast();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const storedRole = localStorage.getItem("userRole");
  const accountType = localStorage.getItem("accountType");
  const userRole = propUserRole || storedRole || "staff";

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setShouldRedirect(true);
          setIsLoading(false);
          return;
        }

        // For accountant routes, check account type first
        if (allowedRoles.includes("accountant") && accountType === "accountant") {
          setIsLoading(false);
          return;
        }
        
        // If no stored role/accountType, fetch from database using proper client method
        if (!storedRole || !accountType) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role, account_type')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            setShouldRedirect(true);
            setIsLoading(false);
            return;
          }

          if (profile) {
            localStorage.setItem('userRole', profile.role || 'staff');
            localStorage.setItem('accountType', profile.account_type || 'staff');
            
            // Check access with fetched role
            const finalRole = profile.role || 'staff';
            const finalAccountType = profile.account_type || 'staff';
            
            if (allowedRoles.includes("accountant") && finalAccountType === "accountant") {
              setIsLoading(false);
              return;
            }
            
            if (!allowedRoles.includes(finalRole)) {
              setShouldRedirect(true);
            }
          } else {
            setShouldRedirect(true);
          }
        } else {
          // Check with stored role
          if (!allowedRoles.includes(userRole)) {
            setShouldRedirect(true);
          }
        }
      } catch (error) {
        console.error('Access check error:', error);
        setShouldRedirect(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [userRole, accountType, allowedRoles, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (shouldRedirect) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
