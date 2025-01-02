import { ClockInButton } from "@/components/ClockInButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Card } from "@/components/ui/card";
import { NeuralNetwork } from "@/components/NeuralNetwork";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Neural Network Background */}
      <div className="absolute inset-0 z-0">
        <NeuralNetwork />
      </div>

      {/* Theme Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher />
      </div>

      {/* Main Content */}
      <Card className="w-full max-w-4xl mx-auto p-8 animate-fade-in glass relative z-10 bg-background/80 backdrop-blur-xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/72968663-d83e-449d-a8c5-5097fe0015d9.png" 
                alt="CT Communication Towers" 
                className="h-24 w-auto animate-fade-in hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-fade-in">
              CTNL AI WORK-BOARD
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in delay-100">
              Welcome to Communication Towers Nigeria Limited Artificial Intelligence Enabled Work-Board System. Dear Esteemed Staff please clock in to start your working.
            </p>
          </div>

          {/* Clock In Section */}
          <div className="flex flex-col items-center gap-8">
            <div className="animate-pulse">
              <ClockInButton />
            </div>
            <p className="text-sm text-muted-foreground animate-fade-in delay-200">
              Click to clock in and proceed to login
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;