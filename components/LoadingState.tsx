export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-soft">
      <div className="h-4 w-32 animate-pulse rounded-full bg-stone-200" />
      <div className="mt-4 space-y-3">
        <div className="h-3 w-full animate-pulse rounded-full bg-stone-100" />
        <div className="h-3 w-3/4 animate-pulse rounded-full bg-stone-100" />
      </div>
      <p className="sr-only">{label}</p>
    </div>
  );
}
