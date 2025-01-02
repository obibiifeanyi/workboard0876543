import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { LogOut, Home, BarChart2, Users, Settings } from "lucide-react";
import { NotificationCenter } from "./NotificationCenter";
import { ChatBox } from "./ChatBox";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-dark text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-16 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-6 gap-6">
        <Button variant="ghost" size="icon" className="text-emerald hover:bg-emerald/10">
          <Home className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-emerald hover:bg-emerald/10">
          <BarChart2 className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-emerald hover:bg-emerald/10">
          <Users className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-emerald hover:bg-emerald/10">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="pl-16">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-black/20">
          <div className="flex h-16 items-center px-6 gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald to-purple-light bg-clip-text text-transparent">
              {title}
            </h1>
            <div className="ml-auto flex items-center space-x-4">
              <NotificationCenter />
              <ThemeSwitcher />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleSignOut}
                className="text-emerald hover:bg-emerald/10"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto py-6 px-4">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>

        {/* AI Chat Box */}
        <ChatBox />
      </div>
    </div>
  );
};