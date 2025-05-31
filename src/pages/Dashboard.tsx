
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "lucide-react";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('No user found, redirecting to login');
        navigate("/login");
        return;
      }

      if (profile) {
        // Redirect based on account_type, with role as fallback
        const accountType = profile.account_type || profile.role;
        
        console.log('Dashboard redirect - User:', user.id, 'Account Type:', accountType, 'Role:', profile.role);
        
        switch (accountType) {
          case 'admin':
            navigate("/admin", { replace: true });
            break;
          case 'manager':
            navigate("/manager", { replace: true });
            break;
          case 'accountant':
            navigate("/accountant", { replace: true });
            break;
          case 'hr':
            navigate("/hr", { replace: true });
            break;
          case 'staff':
          default:
            navigate("/staff", { replace: true });
            break;
        }
      }
    }
  }, [user, profile, loading, navigate]);

  // Show loading while determining redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default Dashboard;
