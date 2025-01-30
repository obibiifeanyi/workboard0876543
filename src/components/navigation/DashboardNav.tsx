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
} from "lucide-react";

export const DashboardNav = () => {
  const navItems = [
    { to: "/manager/dashboard", icon: Activity, label: "Dashboard" },
    { to: "/manager/team", icon: Users, label: "Team" },
    { to: "/manager/projects", icon: FileText, label: "Projects" },
    { to: "/manager/time", icon: Clock, label: "Time Management" },
    { to: "/manager/sites", icon: Network, label: "Telecom Sites" },
    { to: "/manager/reports", icon: Database, label: "Reports" },
    { to: "/manager/communication", icon: Mail, label: "Communication" },
    { to: "/manager/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-lg px-3 py-2 transition-colors
             ${
               isActive
                 ? "bg-manager-primary text-white"
                 : "text-foreground hover:bg-manager-accent hover:text-manager-primary"
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