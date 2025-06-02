
import { ClockInButton } from "@/components/ClockInButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  const redirectUserBasedOnRole = (role: string, accountType: string) => {
    console.log('Index: Redirecting user based on role:', role, 'accountType:', accountType);
    
    if (accountType === 'accountant') {
      navigate('/accountant');
    } else if (accountType === 'hr' || role === 'hr') {
      navigate('/hr');
    } else if (accountType === 'admin' || role === 'admin') {
      navigate('/admin');
    } else if (accountType === 'manager' || role === 'manager') {
      navigate('/manager');
    } else {
      navigate('/staff');
    }
  };

  useEffect(() => {
    if (!loading) {
      if (user && profile) {
        console.log('Index: User is logged in, redirecting...');
        const role = profile.role || 'staff';
        const accountType = profile.account_type || 'staff';
        redirectUserBasedOnRole(role, accountType);
      } else {
        setIsLoading(false);
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 text-foreground">
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      <Card className="w-full max-w-4xl mx-auto p-6 sm:p-8 animate-fade-in glass relative
                      bg-background/80 backdrop-blur-xl border-primary/20 hover:border-primary/40
                      transition-all duration-300">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-3">
            <img 
              src="/lovable-uploads/491c7e61-a4fb-46a3-a002-904b84354e48.png" 
              alt="CT Communication Towers Logo" 
              className="h-16 w-auto mx-auto mb-2"
            />
          </div>

          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="animate-pulse">
              <ClockInButton />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground animate-fade-in delay-200">
              Click to clock in and proceed to login
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;
