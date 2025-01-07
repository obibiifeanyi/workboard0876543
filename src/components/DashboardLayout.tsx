import { NavBar } from "./layout/NavBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  department?: string;
}

export const DashboardLayout = ({ children, title, department }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar department={department} />
      <main className="pt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
};