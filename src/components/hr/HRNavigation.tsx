
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
    <nav className="space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-lg px-3 py-2 transition-colors
             ${
               isActive
                 ? "bg-primary text-white dark:bg-primary/90"
                 : "text-foreground hover:bg-accent hover:text-primary"
             }`
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};
