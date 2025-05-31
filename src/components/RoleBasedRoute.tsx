
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const { toast } = useToast();
  const { user, profile, loading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('No user found, redirecting to login');
        setShouldRedirect(true);
        return;
      }

      if (profile) {
        const userRole = profile.role || 'staff';
        const accountType = profile.account_type || 'staff';
        
        // Check if user has access to the route
        const hasAccess = 
          allowedRoles.includes(userRole) ||
          allowedRoles.includes(accountType) ||
          (allowedRoles.includes("admin") && (accountType === "admin" || userRole === "admin")) ||
          (allowedRoles.includes("manager") && (accountType === "manager" || userRole === "manager")) ||
          (allowedRoles.includes("accountant") && accountType === "accountant") ||
          (allowedRoles.includes("hr") && (accountType === "hr" || userRole === "hr"));

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
    }
  }, [user, profile, loading, allowedRoles, toast]);

  if (loading) {
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
