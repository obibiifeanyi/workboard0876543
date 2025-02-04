import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EnhancedChartCardProps {
  title: string;
  icon: LucideIcon;
  stats: {
    label: string;
    value: string;
    change?: string;
  }[];
  chartData?: number[];
  timeRange?: string;
  onViewDetails?: () => void;
  className?: string;
}

export const EnhancedChartCard = ({
  title,
  icon: Icon,
  stats,
  chartData = [40, 60, 75, 45, 85, 65, 95],
  timeRange = "Last 7 days",
  onViewDetails,
  className,
}: EnhancedChartCardProps) => {
  return (
    <Card className={cn(
      "group relative p-4 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/20",
      className
    )}>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-30" />
      <div className="absolute inset-px rounded-[11px] bg-background" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
              <Icon className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          </div>

          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-semibold text-foreground">{stat.value}</p>
              {stat.change && (
                <span className="text-xs font-medium text-emerald-500">{stat.change}</span>
              )}
            </div>
          ))}
        </div>

        <div className="mb-4 h-24 w-full overflow-hidden rounded-lg bg-muted/50 p-3">
          <div className="flex h-full w-full items-end justify-between gap-1">
            {chartData.map((value, index) => (
              <div key={index} className="h-full w-3 rounded-sm bg-indigo-500/30">
                <div
                  className="w-full rounded-sm bg-indigo-500 transition-all duration-300"
                  style={{ height: `${value}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">{timeRange}</span>
          </div>

          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-600"
            >
              View Details
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};