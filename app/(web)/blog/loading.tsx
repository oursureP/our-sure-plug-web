export default function BlogLoading() {
  return (
    <div className="bg-background pt-28 pb-20 lg:pt-32 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mx-auto mb-3 h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="mx-auto mb-4 h-12 w-2/3 animate-pulse rounded-lg bg-muted" />
          <div className="mx-auto h-4 w-full max-w-md animate-pulse rounded bg-muted" />
        </div>
        <div className="mb-10 h-72 animate-pulse rounded-3xl bg-muted" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
