import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface RoleBasedRouteProps {
  element: React.ReactElement;
  allowedRoles: string[];
  userRole?: string;
}

export const RoleBasedRoute = ({ element, allowedRoles, userRole = "staff" }: RoleBasedRouteProps) => {
  const { toast } = useToast();

  if (!userRole || !allowedRoles.includes(userRole)) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/login" replace />;
  }

  return element;
};