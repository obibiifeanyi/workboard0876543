
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  Award,
  FileText,
  TrendingUp,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const HRNavigation = () => {
  const navItems = [
    { to: "/hr", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/hr/employees", icon: Users, label: "Employee Management" },
    { to: "/hr/leave", icon: Calendar, label: "Leave Management" },
    { to: "/hr/payroll", icon: Clock, label: "Payroll" },
    { to: "/hr/performance", icon: Award, label: "Performance Reviews" },
    { to: "/hr/reports", icon: FileText, label: "HR Reports" },
    { to: "/hr/analytics", icon: TrendingUp, label: "Analytics" },
    { to: "/hr/communications", icon: MessageSquare, label: "Communications" },
    { to: "/hr/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">HR Dashboard</h2>
        <p className="text-sm text-muted-foreground">Manage human resources</p>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                "hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20",
                isActive
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 border-r-2 border-red-600"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
