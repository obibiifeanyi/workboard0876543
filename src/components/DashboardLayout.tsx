
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MainNavBar } from "@/components/navigation/MainNavBar";
import { SidebarProvider } from "@/components/ui/sidebar";

export interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  navigation?: ReactNode;
  className?: string;
}

export const DashboardLayout = ({
  children,
  title,
  navigation,
  className,
}: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className={cn("min-h-screen w-full bg-gradient-to-br from-background to-muted/20 flex flex-col", className)}>
        <MainNavBar />
        <div className="flex flex-1">
          {navigation && (
            <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 
                             bg-gradient-to-b from-white/95 to-white/80 dark:from-black/95 dark:to-black/80 
                             backdrop-blur-xl border-r border-red-600/20 
                             transition-all duration-300 ease-in-out lg:translate-x-0 translate-x-[-100%] 
                             peer-data-[state=expanded]:translate-x-0
                             shadow-xl shadow-red-600/10">
              <div className="flex h-full flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-red-600/20">
                {navigation}
              </div>
            </aside>
          )}
          <main className={cn(
            "flex-1 transition-all duration-300 ease-in-out mt-16 flex flex-col",
            navigation && "lg:ml-64",
            "min-h-[calc(100vh-4rem)]"
          )}>
            <div className="flex-1 p-4 sm:p-6 md:p-8">
              <div className="mx-auto max-w-7xl space-y-6">
                {/* Enhanced Title Section */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-white/80 to-white/60 dark:from-black/40 dark:to-black/20 
                               backdrop-blur-xl border border-red-600/20 shadow-lg">
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 
                               bg-clip-text text-transparent">
                    {title}
                  </h1>
                </div>
                
                {/* Content */}
                <div className="space-y-6">
                  {children}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <footer className="mt-auto p-4 border-t border-red-600/20 bg-gradient-to-r from-white/80 to-white/60 dark:from-black/40 dark:to-black/20 backdrop-blur-xl">
              <div className="mx-auto max-w-7xl">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Built by <span className="font-medium text-red-600">Obibi Ifeanyi</span> - BMD Tech Hub
                  </p>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
