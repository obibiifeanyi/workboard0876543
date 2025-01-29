import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { NavBar } from "@/components/NavBar";
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
      <div className={cn("min-h-screen w-full bg-background", className)}>
        <NavBar />
        <div className="flex">
          {navigation && (
            <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-[calc(100%-4rem)] flex-col overflow-y-auto px-3 py-4">
                {navigation}
              </div>
            </aside>
          )}
          <main className={cn("flex-1 p-8 mt-16", navigation && "ml-64")}>
            <div className="mx-auto max-w-7xl">
              <h1 className="mb-8 text-3xl font-bold text-admin-primary">{title}</h1>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};