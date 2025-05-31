
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log('No session found, redirecting to login');
          setShouldRedirect(true);
          setIsLoading(false);
          return;
        }

        // Fetch user profile to get role and account type
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, account_type')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          // Set default values if profile doesn't exist
          setUserRole('staff');
          setAccountType('staff');
          localStorage.setItem('userRole', 'staff');
          localStorage.setItem('accountType', 'staff');
        } else {
          const finalRole = profile.role || 'staff';
          const finalAccountType = profile.account_type || 'staff';
          
          setUserRole(finalRole);
          setAccountType(finalAccountType);
          localStorage.setItem('userRole', finalRole);
          localStorage.setItem('accountType', finalAccountType);
        }

        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Access check error:', error);
        if (mounted) {
          setShouldRedirect(true);
          setIsLoading(false);
        }
      }
    };

    checkAccess();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoading && userRole && accountType) {
      // Check if user has access to the route
      const hasRoleAccess = allowedRoles.includes(userRole);
      const hasAccountTypeAccess = allowedRoles.includes(accountType);
      const hasSpecialAccess = 
        (allowedRoles.includes("admin") && (accountType === "admin" || userRole === "admin")) ||
        (allowedRoles.includes("manager") && (accountType === "manager" || userRole === "manager")) ||
        (allowedRoles.includes("accountant") && accountType === "accountant") ||
        (allowedRoles.includes("hr") && (accountType === "hr" || userRole === "hr"));

      const hasAccess = hasRoleAccess || hasAccountTypeAccess || hasSpecialAccess;

      if (!hasAccess) {
        console.log(`Access denied. User role: ${userRole}, Account type: ${accountType}, Required roles: ${allowedRoles.join(', ')}`);
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        setShouldRedirect(true);
      }
    }
  }, [userRole, accountType, allowedRoles, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (shouldRedirect) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
