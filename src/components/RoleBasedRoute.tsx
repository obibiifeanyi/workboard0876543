
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
        if (allowedRoles.includes("accountant") && (accountType === "accountant")) {
          setIsLoading(false);
          return;
        }
        
        // For admin routes, check both account type and role
        if (allowedRoles.includes("admin") && (accountType === "admin" || userRole === "admin")) {
          setIsLoading(false);
          return;
        }
        
        // For manager routes, check both account type and role
        if (allowedRoles.includes("manager") && (accountType === "manager" || userRole === "manager")) {
          setIsLoading(false);
          return;
        }
        
        // If no stored role/accountType, fetch from database
        if (!storedRole || !accountType) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role, account_type')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            // Profile should exist due to trigger, but handle gracefully
            localStorage.setItem('userRole', 'staff');
            localStorage.setItem('accountType', 'staff');
            
            if (!allowedRoles.includes('staff')) {
              setShouldRedirect(true);
            }
            setIsLoading(false);
            return;
          }

          if (profile) {
            localStorage.setItem('userRole', profile.role || 'staff');
            localStorage.setItem('accountType', profile.account_type || 'staff');
            
            // Check access with fetched role and account type
            const finalRole = profile.role || 'staff';
            const finalAccountType = profile.account_type || 'staff';
            
            // Check accountant access
            if (allowedRoles.includes("accountant") && finalAccountType === "accountant") {
              setIsLoading(false);
              return;
            }
            
            // Check admin access
            if (allowedRoles.includes("admin") && (finalAccountType === "admin" || finalRole === "admin")) {
              setIsLoading(false);
              return;
            }
            
            // Check manager access
            if (allowedRoles.includes("manager") && (finalAccountType === "manager" || finalRole === "manager")) {
              setIsLoading(false);
              return;
            }
            
            // Check role-based access for staff and other roles
            if (allowedRoles.includes(finalRole) || allowedRoles.includes(finalAccountType)) {
              setIsLoading(false);
              return;
            }
            
            setShouldRedirect(true);
          } else {
            setShouldRedirect(true);
          }
        } else {
          // Check with stored role and account type
          const hasAccess = allowedRoles.includes(userRole) || 
                           allowedRoles.includes(accountType) ||
                           (allowedRoles.includes("admin") && (accountType === "admin" || userRole === "admin")) ||
                           (allowedRoles.includes("manager") && (accountType === "manager" || userRole === "manager")) ||
                           (allowedRoles.includes("accountant") && accountType === "accountant");
          
          if (!hasAccess) {
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
