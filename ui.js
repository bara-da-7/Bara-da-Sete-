export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))" }}>
      <div className="skeleton-pulse" style={{ height: 140 }} />
      <div className="p-3 space-y-2">
        <div className="skeleton-pulse rounded h-4 w-3/4" />
        <div className="skeleton-pulse rounded h-3 w-full" />
        <div className="skeleton-pulse rounded h-5 w-1/3" />
        <div className="flex justify-between mt-3">
          <div className="skeleton-pulse rounded-full w-8 h-8" />
          <div className="skeleton-pulse rounded w-6 h-4" />
          <div className="skeleton-pulse rounded-full w-8 h-8" />
        </div>
      </div>
    </div>
  );
}
