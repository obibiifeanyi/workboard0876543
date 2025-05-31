
import { ClockInButton } from "@/components/ClockInButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Card } from "@/components/ui/card";
import { NeuralNetwork } from "@/components/NeuralNetwork";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
    let mounted = true;

    const checkAuthAndRedirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          console.log('Index: User is logged in, checking role...');
          
          // Check stored credentials first
          const storedRole = localStorage.getItem('userRole');
          const storedAccountType = localStorage.getItem('accountType');
          
          if (storedRole && storedAccountType) {
            redirectUserBasedOnRole(storedRole, storedAccountType);
            return;
          }
          
          // Fetch from database if not stored
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('role, account_type')
              .eq('id', session.user.id)
              .maybeSingle();

            if (!error && profile && mounted) {
              const role = profile.role || 'staff';
              const accountType = profile.account_type || 'staff';
              
              localStorage.setItem('userRole', role);
              localStorage.setItem('accountType', accountType);
              
              redirectUserBasedOnRole(role, accountType);
            } else if (mounted) {
              navigate('/staff');
            }
          } catch (error) {
            console.error('Index: Profile fetch error:', error);
            if (mounted) {
              navigate('/staff');
            }
          }
        }
      } catch (error) {
        console.error('Index: Error checking auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Add a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (mounted) {
        setIsLoading(false);
      }
    }, 2000);

    checkAuthAndRedirect();

    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
    };
  }, [navigate]);

  if (isLoading) {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <NeuralNetwork />
      </div>

      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      <Card className="w-full max-w-4xl mx-auto p-6 sm:p-8 animate-fade-in glass relative z-10 
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
