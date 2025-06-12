import { NavLink } from "react-router-dom";
import { 
  Users, 
  LayoutDashboard, 
  Settings, 
  Key, 
  BarChart3, 
  Bell, 
  Clock, 
  FileText, 
  Calendar, 
  Car, 
  FlaskConical,
  Briefcase,
  Package,
  ShoppingCart,
  FileArchive,
  Library,
  Receipt,
  Building2,
  UserCog
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    value: "dashboard",
    description: "System overview and key metrics",
    to: "/staff-admin/dashboard",
    end: true,
  },
  {
    title: "Office Management",
    icon: Building2,
    value: "office",
    description: "Manage office operations",
    to: "/staff-admin/office",
  },
  {
    title: "HR Management",
    icon: UserCog,
    value: "hr",
    description: "Human resources and personnel",
    to: "/staff-admin/hr",
  },
  {
    title: "Inventory",
    icon: Package,
    value: "inventory",
    description: "Track and manage inventory",
    to: "/staff-admin/inventory",
  },
  {
    title: "Procurement",
    icon: ShoppingCart,
    value: "procurement",
    description: "Manage purchases and vendors",
    to: "/staff-admin/procurement",
  },
  {
    title: "Document Library",
    icon: Library,
    value: "documents",
    description: "Document management system",
    to: "/staff-admin/documents",
  },
  {
    title: "Expense Management",
    icon: Receipt,
    value: "expenses",
    description: "Track and approve expenses",
    to: "/staff-admin/expenses",
  },
  {
    title: "Projects",
    icon: FileText,
    value: "projects",
    description: "Manage projects and tasks",
    to: "/staff-admin/projects",
  },
  {
    title: "Telecom Sites",
    icon: BarChart3,
    value: "telecom-sites",
    description: "Monitor telecom infrastructure",
    to: "/staff-admin/telecom-sites",
  },
  {
    title: "Battery Inventory",
    icon: FlaskConical,
    value: "battery-inventory",
    description: "Track battery stock",
    to: "/staff-admin/battery-inventory",
  },
  {
    title: "System Settings",
    icon: Settings,
    value: "settings",
    description: "Configure system settings",
    to: "/staff-admin/settings",
  }
];

export const StaffAdminNavigation = () => {
  return (
    <div className="w-64 border-r border-red-600/20">
      <div className="border-b border-red-600/20 bg-gradient-to-r from-red-600/10 to-red-500/10">
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold text-red-700">Staff Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">Comprehensive System Management</p>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {/* Header Section */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-600/10 to-red-500/10 border border-red-600/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-red-700 text-sm md:text-base">System Management</h3>
                <p className="text-xs text-red-600/70">Control & Oversee</p>
              </div>
            </div>
          </div>
          {/* Navigation Items */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.value}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "w-full group relative flex items-center gap-3 rounded-2xl px-3 md:px-4 py-2 md:py-3 transition-all duration-300 text-sm md:text-base",
                      isActive
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/25 scale-[1.02]"
                        : "text-foreground hover:bg-gradient-to-r hover:from-red-600/10 hover:to-red-500/10 hover:text-red-700 hover:scale-[1.01]"
                    )
                  }
                  end={item.end}
                >
                  {({ isActive }) => (
                    <>
                      {/* Animated Background */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                      {/* Icon with Glow Effect */}
                      <div className="relative p-1 md:p-2 rounded-xl bg-transparent transition-all duration-300 group-hover:bg-red-600/10 group-hover:shadow-md">
                        <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      {/* Label */}
                      <div className="flex flex-col items-start min-w-0">
                        <span className="font-medium transition-all duration-300 group-hover:translate-x-1 truncate">
                          {item.title}
                        </span>
                        <span className="text-xs text-muted-foreground truncate w-full">
                          {item.description}
                        </span>
                      </div>
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-white to-transparent rounded-r-full transition-opacity duration-300" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
          {/* Footer Section */}
          <div className="mt-8 p-3 md:p-4 rounded-2xl bg-gradient-to-r from-red-600/5 to-red-500/5 border border-red-600/10">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-2">System Status</div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-green-600">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}; 