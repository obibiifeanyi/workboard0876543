import { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
            <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
              {navigation}
            </div>
          </aside>
        )}
        <main className={cn("flex-1 p-8", navigation && "ml-64")}>
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-8 text-3xl font-bold">{title}</h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};