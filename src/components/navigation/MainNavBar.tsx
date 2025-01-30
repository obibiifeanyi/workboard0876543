import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface MainNavBarProps {
  className?: string;
}

export const MainNavBar = ({ className }: MainNavBarProps) => {
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 h-16 border-b",
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/f2f26f75-4ea0-45bb-b1e1-eecd743ebe0a.png" 
              alt="CT Communication Towers Logo" 
              className="h-8 w-auto"
            />
            <span className="hidden text-base sm:text-lg font-semibold text-manager-primary md:inline-block">
              Manager's Dashboard
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
};