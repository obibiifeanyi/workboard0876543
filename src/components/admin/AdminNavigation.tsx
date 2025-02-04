
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
  Settings,
  Mail,
  LayoutDashboard,
} from "lucide-react";

export const AdminNavigation = () => {
  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
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
    { to: "/admin/communication", icon: Mail, label: "Communication" },
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
                 ? "bg-admin-primary text-white dark:bg-admin-primary/90"
                 : "text-foreground hover:bg-admin-accent hover:text-admin-primary"
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
