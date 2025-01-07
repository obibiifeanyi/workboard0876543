import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { EnhancedNotificationCenter } from "@/components/notifications/EnhancedNotificationCenter";
import { useToast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailNotification = (emailData: any) => {
    toast({
      title: "Email Notification",
      description: "New email notification received",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <div className="flex items-center gap-4">
            <EnhancedNotificationCenter />
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};