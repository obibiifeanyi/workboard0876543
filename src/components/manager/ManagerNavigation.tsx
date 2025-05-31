
import { Users, FolderOpen, ClipboardList, Building2, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
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
    <Sidebar className="w-64 border-r border-red-600/20">
      <SidebarHeader className="border-b border-red-600/20 bg-gradient-to-r from-red-600/10 to-red-500/10">
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold text-red-700">Manager Dashboard</h2>
          <p className="text-sm text-muted-foreground">Manage your team and projects</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <ScrollArea className="flex-1">
          <SidebarGroup>
            <SidebarGroupLabel className="text-red-700 font-medium">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.value;
                  
                  return (
                    <SidebarMenuItem key={item.value}>
                      <SidebarMenuButton
                        onClick={() => onTabChange?.(item.value)}
                        isActive={isActive}
                        className={cn(
                          "w-full justify-start gap-3 px-3 py-2 h-auto",
                          "hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20",
                          "transition-all duration-200",
                          isActive 
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 border-r-2 border-red-600" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <div className="flex flex-col items-start min-w-0">
                          <span className="font-medium truncate">{item.title}</span>
                          <span className="text-xs text-muted-foreground truncate w-full">
                            {item.description}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
};
