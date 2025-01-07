import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { EnhancedNotificationCenter } from "@/components/notifications/EnhancedNotificationCenter";
import { Building } from "lucide-react";

interface NavBarProps {
  department?: string;
}

export const NavBar = ({ department }: NavBarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          {department && (
            <span className="text-sm font-medium text-muted-foreground">
              {department}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <EnhancedNotificationCenter />
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
};