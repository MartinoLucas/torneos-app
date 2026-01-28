import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-50" />
        <Skeleton className="h-10 w-25" />
      </div>
      <div className="rounded-md border border-zinc-200">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex p-4 border-b border-zinc-100 last:border-0">
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}