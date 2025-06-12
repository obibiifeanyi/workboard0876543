import { NavLink } from "react-router-dom";
import { 
  Users, 
  LayoutDashboard, 
  Settings, 
  BarChart3, 
  FileText, 
  Package,
  ShoppingCart,
  Library,
  Receipt,
  Building2,
  UserCog,
  FlaskConical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    value: "dashboard",
    description: "System overview and key metrics",
    to: "/office-admin/dashboard",
    end: true,
  },
  {
    title: "Office Management",
    icon: Building2,
    value: "office",
    description: "Manage office operations",
    to: "/office-admin/office",
  },
  {
    title: "HR Management",
    icon: UserCog,
    value: "hr",
    description: "Human resources and personnel",
    to: "/office-admin/hr",
  },
  {
    title: "Inventory",
    icon: Package,
    value: "inventory",
    description: "Track and manage inventory",
    to: "/office-admin/inventory",
  },
  {
    title: "Procurement",
    icon: ShoppingCart,
    value: "procurement",
    description: "Manage purchases and vendors",
    to: "/office-admin/procurement",
  },
  {
    title: "Document Library",
    icon: Library,
    value: "documents",
    description: "Document management system",
    to: "/office-admin/documents",
  },
  {
    title: "Expense Management",
    icon: Receipt,
    value: "expenses",
    description: "Track and approve expenses",
    to: "/office-admin/expenses",
  },
  {
    title: "Projects",
    icon: FileText,
    value: "projects",
    description: "Manage projects and tasks",
    to: "/office-admin/projects",
  },
  {
    title: "Telecom Sites",
    icon: BarChart3,
    value: "telecom-sites",
    description: "Monitor telecom infrastructure",
    to: "/office-admin/telecom-sites",
  },
  {
    title: "Battery Inventory",
    icon: FlaskConical,
    value: "battery-inventory",
    description: "Track battery stock",
    to: "/office-admin/battery-inventory",
  },
  {
    title: "System Settings",
    icon: Settings,
    value: "settings",
    description: "Configure system settings",
    to: "/office-admin/settings",
  }
];

export const OfficeAdminNavigation = () => {
  return (
    <div className="w-64 border-r border-red-600/20">
      <div className="border-b border-red-600/20 bg-gradient-to-r from-red-600/10 to-red-500/10">
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold text-red-700">Office Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">Comprehensive Office Management</p>
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
                <h3 className="font-semibold text-red-700 text-sm md:text-base">Office Management</h3>
                <p className="text-xs text-red-600/70">Control & Oversee</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.value}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-red-50 dark:hover:bg-red-900/20",
                    isActive
                      ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      : "text-muted-foreground hover:text-red-700 dark:hover:text-red-300"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}; 