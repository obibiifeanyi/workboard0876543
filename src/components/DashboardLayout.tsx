import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";

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
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="flex">
        {navigation && (
          <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-center border-b bg-admin-accent">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-admin-primary animate-pulse" />
                <span className="text-lg font-semibold text-admin-primary">
                  Admin Portal
                </span>
              </div>
            </div>
            <div className="flex h-[calc(100%-4rem)] flex-col overflow-y-auto px-3 py-4">
              {navigation}
            </div>
          </aside>
        )}
        <main className={cn("flex-1 p-8", navigation && "ml-64")}>
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-8 text-3xl font-bold text-admin-primary">{title}</h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};