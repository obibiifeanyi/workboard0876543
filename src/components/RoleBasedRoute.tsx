
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

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
        // For accountant routes, check account type first
        if (allowedRoles.includes("accountant") && accountType === "accountant") {
          setIsLoading(false);
          return;
        }
        
        if (!allowedRoles.includes(userRole)) {
          setShouldRedirect(true);
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
