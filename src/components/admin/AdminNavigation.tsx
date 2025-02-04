import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  CalendarClock,
  Clock,
  Network,
  Activity,
  Brain,
  Database,
  Mail,
} from "lucide-react";

export const AdminNavigation = () => {
  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/admin/users", icon: Users, label: "Users & Teams" },
    { to: "/admin/departments", icon: Building2, label: "Departments" },
    { to: "/admin/projects", icon: FileText, label: "Projects & Tasks" },
    { to: "/admin/time", icon: Clock, label: "Time & Attendance" },
    { to: "/admin/telecom-sites", icon: Network, label: "Sites & Reports" },
    { to: "/admin/activity", icon: Activity, label: "Activity & Analytics" },
    { to: "/admin/ai", icon: Brain, label: "AI & Knowledge" },
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