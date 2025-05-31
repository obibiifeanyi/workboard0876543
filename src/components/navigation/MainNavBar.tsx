import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RealTimeNotificationCenter } from "@/components/notifications/RealTimeNotificationCenter";
import { AIChatBox } from "@/components/ai/AIChatBox";

interface MainNavBarProps extends React.HTMLAttributes<HTMLElement> {}

export const MainNavBar = ({ className, ...props }: MainNavBarProps) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <>
      <nav className={cn("border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)} {...props}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center">
              <img
                src="/lovable-uploads/491c7e61-a4fb-46a3-a002-904b84354e48.png"
                alt="CT Communication Towers Logo"
                className="h-8 w-auto mr-2"
              />
              <span className="font-bold text-xl">CT Towers</span>
            </a>
            
            <div className="flex items-center space-x-4">
              <RealTimeNotificationCenter />
              <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={profile?.full_name || "User Avatar"} />
                      <AvatarFallback>{profile?.full_name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    {profile?.email || user?.email || "No Email"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <ThemeSwitcher />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Add AI Chat Box */}
      <AIChatBox />
    </>
  );
};
