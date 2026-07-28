export default function ServiceDetailLoading() {
  return (
    <div className="bg-background pt-28 pb-20 lg:pt-32 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 h-4 w-28 animate-pulse rounded bg-muted" />
        <div className="mb-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-6 h-16 w-16 animate-pulse rounded-2xl bg-muted" />
            <div className="mb-4 h-12 w-2/3 animate-pulse rounded-lg bg-muted" />
            <div className="mb-2 h-4 w-full animate-pulse rounded bg-muted" />
            <div className="mb-8 h-4 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-12 w-40 animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="aspect-4/3 animate-pulse rounded-3xl bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl border border-border bg-card dark:bg-[#161427]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
