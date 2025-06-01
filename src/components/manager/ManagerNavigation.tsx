
import { Users, FolderOpen, ClipboardList, Building2, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const navigationItems = [
  {
    title: "Team Overview",
    icon: Users,
    value: "team",
    description: "View and manage your team members"
  },
  {
    title: "Projects",
    icon: FolderOpen,
    value: "sites", 
    description: "Create and manage department projects"
  },
  {
    title: "Task Assignment",
    icon: ClipboardList,
    value: "workboard",
    description: "Assign tasks to team members"
  },
  {
    title: "Departments",
    icon: Building2,
    value: "construction",
    description: "Manage department information"
  },
  {
    title: "Analytics",
    icon: BarChart3,
    value: "analytics",
    description: "View performance metrics and charts"
  }
];

interface ManagerNavigationProps {
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export const ManagerNavigation = ({ activeTab, onTabChange }: ManagerNavigationProps) => {
  return (
    <div className="w-64 border-r border-red-600/20">
      <div className="border-b border-red-600/20 bg-gradient-to-r from-red-600/10 to-red-500/10">
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold text-red-700">Manager Dashboard</h2>
          <p className="text-sm text-muted-foreground">Manage your team and projects</p>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {/* Header Section */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-600/10 to-red-500/10 
                         border border-red-600/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-red-700 text-sm md:text-base">Team Management</h3>
                <p className="text-xs text-red-600/70">Lead & Organize</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.value;
              
              return (
                <button
                  key={item.value}
                  onClick={() => onTabChange?.(item.value)}
                  className={cn(
                    "w-full group relative flex items-center gap-3 rounded-2xl px-3 md:px-4 py-2 md:py-3 transition-all duration-300 text-sm md:text-base",
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/25 scale-[1.02]"
                      : "text-foreground hover:bg-gradient-to-r hover:from-red-600/10 hover:to-red-500/10 hover:text-red-700 hover:scale-[1.01]"
                  )}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 opacity-0 
                                 group-hover:opacity-10 transition-opacity duration-300" />
                  
                  {/* Icon with Glow Effect */}
                  <div className="relative p-1 md:p-2 rounded-xl bg-transparent transition-all duration-300
                               group-hover:bg-red-600/10 group-hover:shadow-md">
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

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-white to-transparent 
                                   rounded-r-full transition-opacity duration-300" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer Section */}
          <div className="mt-8 p-3 md:p-4 rounded-2xl bg-gradient-to-r from-red-600/5 to-red-500/5 
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
      </ScrollArea>
    </div>
  );
};
