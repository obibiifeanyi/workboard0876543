import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { EnhancedNotificationCenter } from "@/components/notifications/EnhancedNotificationCenter";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface NavBarProps {
  className?: string;
}

export const NavBar = ({ className }: NavBarProps) => {
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 h-16 border-b",
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-admin-primary animate-pulse" />
            <span className="hidden text-lg font-semibold text-admin-primary md:inline-block">
              Admin Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <EnhancedNotificationCenter />
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
};