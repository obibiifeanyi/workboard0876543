
import { Users, FolderOpen, ClipboardList, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Team Overview",
    icon: Users,
    href: "#team",
    description: "View and manage your team members"
  },
  {
    title: "Projects",
    icon: FolderOpen,
    href: "#projects", 
    description: "Create and manage department projects"
  },
  {
    title: "Task Assignment",
    icon: ClipboardList,
    href: "#tasks",
    description: "Assign tasks to team members"
  },
  {
    title: "Departments",
    icon: Building2,
    href: "#departments",
    description: "Manage department information"
  }
];

export const ManagerNavigation = () => {
  return (
    <nav className="flex flex-col p-4 space-y-2">
      <div className="px-3 py-2 mb-4">
        <h2 className="text-lg font-semibold text-red-700">Manager Dashboard</h2>
        <p className="text-sm text-muted-foreground">Manage your team and projects</p>
      </div>
      
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              "hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20",
              "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <div className="flex flex-col">
              <span>{item.title}</span>
              <span className="text-xs text-muted-foreground">{item.description}</span>
            </div>
          </a>
        );
      })}
    </nav>
  );
};
