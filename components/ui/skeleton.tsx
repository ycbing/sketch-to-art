import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-muted",
        className
      )}
    />
  );
}

export function ArtworkSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 8 }, (_, i) => (
          <ArtworkSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function StyleSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="space-y-2 p-3 rounded-xl bg-muted/50">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="h-3 w-2/3 mx-auto" />
          <Skeleton className="h-2 w-1/2 mx-auto" />
        </div>
      ))}
    </div>
  );
}