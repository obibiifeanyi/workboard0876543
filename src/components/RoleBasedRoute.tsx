import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

interface RoleBasedRouteProps {
  element: React.ReactElement;
  allowedRoles: string[];
  userRole?: string;
}

export const RoleBasedRoute = ({ element, allowedRoles, userRole: propUserRole }: RoleBasedRouteProps) => {
  const { toast } = useToast();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const storedRoles = JSON.parse(localStorage.getItem("userRoles") || "[]");
  const userRole = propUserRole || localStorage.getItem("userRole") || "staff";

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Check if user has any of the allowed roles
        const hasAccess = allowedRoles.some(role => 
          storedRoles.includes(role) || userRole === role
        );

        if (!hasAccess) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          setShouldRedirect(true);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to verify access. Redirecting to login.",
          variant: "destructive",
        });
        setShouldRedirect(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [userRole, allowedRoles, toast, storedRoles]);

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

  return element;
};