
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DashboardClockInButton } from "@/components/DashboardClockInButton";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { MainNavBar } from "@/components/navigation/MainNavBar";
import { SEOBreadcrumbs } from "@/components/shared/SEOBreadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
  seoDescription?: string;
  seoKeywords?: string;
}

export const DashboardLayout = ({ 
  title, 
  children, 
  navigation, 
  actions,
  seoDescription,
  seoKeywords
}: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { profile } = useAuth();

  // Only show DashboardClockInButton for staff users and not on manager/admin dashboards
  const showClockInButton = profile?.role === 'staff' && 
    !location.pathname.includes('/manager') && 
    !location.pathname.includes('/admin') &&
    !location.pathname.includes('/accountant') &&
    !location.pathname.includes('/hr');

  const navbarActions = (
    <div className="flex items-center space-x-2">
      {showClockInButton && <DashboardClockInButton />}
      {actions}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <SEOHead 
        title={title}
        description={seoDescription}
        keywords={seoKeywords}
      />
      
      <MainNavBar title={title} actions={navbarActions} />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        {navigation && (
          <aside
            className={cn(
              "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r transition-transform duration-300 dark:bg-gray-900 dark:border-gray-800",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full",
              "lg:translate-x-0 lg:border-r"
            )}
          >
            <div className="p-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mb-4 lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              {navigation}
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className={cn(
          "flex-1 transition-all duration-300 pt-0",
          navigation ? (isSidebarOpen ? "ml-64" : "ml-0 lg:ml-64") : "ml-0"
        )}>
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <SEOBreadcrumbs />
              {children}
            </div>
          </div>
          
          {/* Footer */}
          <footer className="mt-12 border-t bg-white/50 dark:bg-black/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="text-center text-sm text-muted-foreground">
                Licensed By <span className="font-semibold text-primary">BMD Tech Hub</span> • 
                Usage Rights by <span className="font-semibold text-primary">CT NIGERIA LTD</span> • 
                © 2025 All Rights Reserved
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
