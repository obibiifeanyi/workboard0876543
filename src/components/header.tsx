import * as React from "react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  text?: string;
  action?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  action,
  className,
  ...props
}: DashboardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)} {...props}>
      <div className="grid gap-1">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">{heading}</h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
