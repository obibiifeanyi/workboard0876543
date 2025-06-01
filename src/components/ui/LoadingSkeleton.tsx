
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
}

export const LoadingSkeleton = ({ rows = 3, className }: LoadingSkeletonProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
};

export const CardLoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 space-y-3">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      <CardLoadingSkeleton />
    </div>
  );
};
