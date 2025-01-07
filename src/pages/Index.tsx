import { ClockInButton } from "@/components/ClockInButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Card } from "@/components/ui/card";
import { NeuralNetwork } from "@/components/NeuralNetwork";
import { NotificationCenter } from "@/components/NotificationCenter";
import { ChatBox } from "@/components/ChatBox";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <img 
            src="/lovable-uploads/72968663-d83e-449d-a8c5-5097fe0015d9.png" 
            alt="CT Communication Towers"
            className="h-24 w-auto mx-auto animate-logo-pulse"
          />
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

      <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
        <NotificationCenter />
        <ThemeSwitcher />
      </div>

      <Card className="w-full max-w-4xl mx-auto p-6 sm:p-8 animate-fade-in glass relative z-10 bg-background/80 backdrop-blur-xl">
        <div className="space-y-8 sm:space-y-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/72968663-d83e-449d-a8c5-5097fe0015d9.png" 
                alt="CT Communication Towers" 
                className="h-16 sm:h-24 w-auto animate-fade-in hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-fade-in">
              CTNL AI WORK-BOARD
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto animate-fade-in delay-100">
              Welcome to Communication Towers Nigeria Limited Artificial Intelligence Enabled Work-Board System. Dear Esteemed Staff please clock in to start your working.
            </p>
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

      <div className="fixed bottom-4 right-4 z-50">
        <ChatBox />
      </div>
    </div>
  );
};

export default Index;