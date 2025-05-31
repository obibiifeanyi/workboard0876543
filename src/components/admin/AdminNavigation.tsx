
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Clock,
  Network,
  Activity,
  Brain,
  Mail,
  Shield,
  ChevronRight,
} from "lucide-react";

export const AdminNavigation = () => {
  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true, color: "from-red-500 to-red-600" },
    { to: "/admin/users", icon: Users, label: "Users & Teams", color: "from-red-500 to-red-700" },
    { to: "/admin/departments", icon: Building2, label: "Departments", color: "from-red-600 to-red-700" },
    { to: "/admin/projects", icon: FileText, label: "Projects & Tasks", color: "from-red-500 to-orange-500" },
    { to: "/admin/time", icon: Clock, label: "Time & Attendance", color: "from-red-600 to-pink-500" },
    { to: "/admin/telecom-sites", icon: Network, label: "Sites & Reports", color: "from-red-500 to-red-600" },
    { to: "/admin/activity", icon: Activity, label: "Activity & Analytics", color: "from-red-700 to-red-800" },
    { to: "/admin/ai", icon: Brain, label: "AI & Knowledge", color: "from-red-600 to-purple-600" },
    { to: "/admin/communication", icon: Mail, label: "Communication", color: "from-red-500 to-pink-500" },
  ];

  return (
    <div className="space-y-2 p-4">
      {/* Header Section */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-600/10 to-red-500/10 
                     border border-red-600/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-red-700">Admin Control</h3>
            <p className="text-xs text-red-600/70">System Management</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300
               ${
                 isActive
                   ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/25 scale-[1.02]"
                   : "text-foreground hover:bg-gradient-to-r hover:from-red-600/10 hover:to-red-500/10 hover:text-red-700 hover:scale-[1.01]"
               }`
            }
          >
            {/* Animated Background */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color} opacity-0 
                           group-hover:opacity-10 transition-opacity duration-300`} />
            
            {/* Icon with Glow Effect */}
            <div className="relative p-2 rounded-xl bg-transparent transition-all duration-300
                         group-hover:bg-red-600/10 group-hover:shadow-md">
              <item.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            </div>

            {/* Label */}
            <span className="font-medium transition-all duration-300 group-hover:translate-x-1">
              {item.label}
            </span>

            {/* Arrow Indicator */}
            <ChevronRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 
                                   group-hover:opacity-100 group-hover:translate-x-0" />

            {/* Active Indicator */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-white to-transparent 
                           rounded-r-full opacity-0 group-data-[active]:opacity-100 transition-opacity duration-300" />
          </NavLink>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-red-600/5 to-red-500/5 
                     border border-red-600/10">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-2">System Status</div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-medium text-green-600">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};
