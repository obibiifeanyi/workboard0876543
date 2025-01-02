import { Navigate } from "react-router-dom";

interface RoleBasedRouteProps {
  element: React.ReactElement;
  allowedRoles: string[];
  userRole?: string;
}

export const RoleBasedRoute = ({ element, allowedRoles, userRole = "staff" }: RoleBasedRouteProps) => {
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return element;
};