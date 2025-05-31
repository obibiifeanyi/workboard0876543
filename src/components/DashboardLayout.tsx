
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { ClockInButton } from "@/components/ClockInButton";
import { NeuralNetwork } from "@/components/NeuralNetwork";
import { useLocation } from "react-router-dom";

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
  navigation?: React.ReactNode;
}

export const DashboardLayout = ({ title, children, navigation }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  // Don't show ClockInButton on manager or admin dashboards
  const showClockInButton = !location.pathname.includes('/manager') && !location.pathname.includes('/admin');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <NeuralNetwork />
      
      {/* Top Bar */}
      <header className="fixed w-full top-0 z-40 bg-white/90 dark:bg-black/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <h1 className="text-xl font-semibold font-unica">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            {showClockInButton && <ClockInButton />}
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-30 h-full w-64 bg-white border-r transition-transform duration-300 dark:bg-gray-900 dark:border-gray-800",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0 lg:border-r"
          )}
        >
          {navigation}
        </aside>

        {/* Main Content Area */}
        <main className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } pt-16`}>
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
          
          {/* Footer */}
          <footer className="mt-12 border-t bg-white/50 dark:bg-black/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="text-center text-sm text-muted-foreground">
                Licensed By <span className="font-semibold text-primary">BMD Tech Hub</span> • 
                Usage Rights by <span className="font-semibold text-primary">CT NIGERIA LTD</span> • 
                © 2025 All Rights Reserved
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
