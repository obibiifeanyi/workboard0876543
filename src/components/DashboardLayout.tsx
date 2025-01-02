import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { LogOut, Bell } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Add sign out logic here
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <ThemeSwitcher />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
};