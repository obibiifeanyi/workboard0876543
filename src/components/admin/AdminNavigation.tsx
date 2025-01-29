import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  Users,
  Building2,
  Network,
  Activity,
  Brain,
  Database,
  Settings,
} from "lucide-react";

export const AdminNavigation = () => {
  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/departments", icon: Building2, label: "Departments" },
    { to: "/admin/telecom-sites", icon: Network, label: "Telecom Sites" },
    { to: "/admin/time", icon: Clock, label: "Time Management" },
    { to: "/admin/activity", icon: Activity, label: "Activity Log" },
    { to: "/admin/ai", icon: Brain, label: "AI Management" },
    { to: "/admin/knowledge", icon: Database, label: "Knowledge Base" },
    { to: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
             ${isActive 
               ? "bg-primary text-primary-foreground" 
               : "hover:bg-muted"
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