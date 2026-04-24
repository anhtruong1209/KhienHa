export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-[28px] bg-slate-100" />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-[32px] bg-slate-100" />
    </div>
  );
}
