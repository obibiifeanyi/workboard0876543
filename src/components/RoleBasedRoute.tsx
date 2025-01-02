import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface RoleBasedRouteProps {
  element: React.ReactElement;
  allowedRoles: string[];
  userRole?: string;
}

export const RoleBasedRoute = ({ element, allowedRoles, userRole = "staff" }: RoleBasedRouteProps) => {
  const { toast } = useToast();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!userRole || !allowedRoles.includes(userRole)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setShouldRedirect(true);
    }
  }, [userRole, allowedRoles, toast]);

  if (shouldRedirect) {
    return <Navigate to="/login" replace />;
  }

  return element;
};