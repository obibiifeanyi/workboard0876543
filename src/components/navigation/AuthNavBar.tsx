import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export const AuthNavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/491c7e61-a4fb-46a3-a002-904b84354e48.png" 
            alt="CT Communication Towers Logo" 
            className="h-8 w-auto"
          />
          <span className="text-lg font-semibold text-primary">
            CT Communication Towers
          </span>
        </div>
        <ThemeSwitcher />
      </div>
    </nav>
  );
};