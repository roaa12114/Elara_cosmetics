
export function SkeletonCard() {
  return (
    <div className="rounded-card border border-line bg-white overflow-hidden animate-pulse">
      <div className="aspect-square bg-line" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3 bg-line rounded-pill w-1/2" />
        <div className="h-4 bg-line rounded-pill w-3/4" />
        <div className="h-4 bg-line rounded-pill w-1/3" />
      </div>
    </div>
  );
}
