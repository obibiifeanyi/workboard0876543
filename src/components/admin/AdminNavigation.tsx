import { NavLink } from "react-router-dom";
import {
  Users,
  Building2,
  Network,
  Clock,
  Activity,
  Brain,
  Database,
  FileText,
  CalendarClock,
} from "lucide-react";

export const AdminNavigation = () => {
  const navItems = [
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/departments", icon: Building2, label: "Departments" },
    { to: "/admin/projects", icon: FileText, label: "Projects" },
    { to: "/admin/leave", icon: CalendarClock, label: "Leave Management" },
    { to: "/admin/time", icon: Clock, label: "Time Management" },
    { to: "/admin/clock-in", icon: Clock, label: "Clock In Monitor" },
    { to: "/admin/telecom-sites", icon: Network, label: "Telecom Sites" },
    { to: "/admin/activity", icon: Activity, label: "Activity Log" },
    { to: "/admin/ai", icon: Brain, label: "AI Management" },
    { to: "/admin/knowledge", icon: Database, label: "Knowledge Base" },
  ];

  return (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
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