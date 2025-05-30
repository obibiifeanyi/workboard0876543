
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "lucide-react";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (!loading && user && profile) {
      // Redirect based on account_type, with role as fallback
      const accountType = profile.account_type || profile.role;
      
      switch (accountType) {
        case 'admin':
          navigate("/admin");
          break;
        case 'manager':
          navigate("/manager");
          break;
        case 'accountant':
          navigate("/accountant");
          break;
        case 'staff':
        default:
          navigate("/documents");
          break;
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default Dashboard;
