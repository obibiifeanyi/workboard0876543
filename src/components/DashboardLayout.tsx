import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== "/staff";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/491c7e61-a4fb-46a3-a002-904b84354e48.png" 
              alt="CT Communication Towers Logo" 
              className="h-10 w-auto"
            />
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Go back</span>
              </Button>
            )}
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};