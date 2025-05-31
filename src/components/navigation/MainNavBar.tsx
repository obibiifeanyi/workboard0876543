
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { cn } from "@/lib/utils";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RealTimeNotificationCenter } from "@/components/notifications/RealTimeNotificationCenter";
import { AIChatBox } from "@/components/ai/AIChatBox";
import { useToast } from "@/hooks/use-toast";

interface MainNavBarProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  actions?: React.ReactNode;
}

export const MainNavBar = ({
  className,
  title,
  actions,
  ...props
}: MainNavBarProps) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign Out Failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <nav className={cn("sticky top-0 z-40 bg-white/90 dark:bg-black/80 backdrop-blur-sm border-b", className)} {...props}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/491c7e61-a4fb-46a3-a002-904b84354e48.png" 
                  alt="CT Communication Towers Logo" 
                  className="h-8 w-auto mr-3" 
                />
              </a>
              {title && (
                <h1 className="text-xl font-semibold font-unica text-red-700 dark:text-red-400">
                  {title}
                </h1>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {actions}
              <RealTimeNotificationCenter />
              <ThemeSwitcher />
              
              <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user?.user_metadata?.avatar_url || ""} 
                        alt={profile?.full_name || "User Avatar"} 
                      />
                      <AvatarFallback>
                        {profile?.full_name?.charAt(0).toUpperCase() || 
                         user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled className="text-xs">
                    <User className="h-3 w-3 mr-2" />
                    {profile?.full_name || "No Name"}
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="text-xs">
                    {profile?.email || user?.email || "No Email"}
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="text-xs capitalize">
                    Role: {profile?.role || 'staff'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 dark:text-red-400">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
      
      <AIChatBox />
    </>
  );
};
