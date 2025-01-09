import { ClockInButton } from "@/components/ClockInButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Card } from "@/components/ui/card";
import { NeuralNetwork } from "@/components/NeuralNetwork";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Check if user is already logged in
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      navigate(`/${userRole.toLowerCase()}`);
    }

    return () => clearTimeout(timer);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-primary mx-auto" />
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
        <div className="space-y-8 sm:space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight 
                         bg-gradient-to-r from-primary via-primary/80 to-primary 
                         bg-clip-text text-transparent animate-fade-in">
              CTNL AI WORK-BOARD
            </h1>
          </div>

          <div className="flex flex-col items-center gap-6 sm:gap-8">
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