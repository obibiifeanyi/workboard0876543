import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface DashboardNavProps {
  items: {
    title: string;
    href: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
  }[];
  className?: string;
}

export function DashboardNav({ items, className }: DashboardNavProps) {
  return (
    <nav className={cn("grid items-start gap-2", className)}>
      {items.map((item, index) => (
        <NavLink
          key={index}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-accent" : "transparent",
              item.variant === "default" ? "justify-start" : "justify-center"
            )
          }
        >
          <item.icon className="mr-2 h-4 w-4" />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}