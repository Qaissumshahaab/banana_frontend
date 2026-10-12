export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-banana-200/70 card-shadow animate-pulse">
      <div className="aspect-[4/5] bg-banana-200/70" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-2/3 bg-banana-200/70 rounded" />
        <div className="h-2.5 w-1/3 bg-banana-100 rounded" />
        <div className="h-6 w-24 bg-banana-100 rounded-full mt-2" />
      </div>
    </div>
  );
}
