export default function BlogPostLoading() {
  return (
    <div className="bg-background pt-28 pb-20 lg:pt-32 lg:pb-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 h-4 w-28 animate-pulse rounded bg-muted" />
        <div className="mb-4 h-6 w-24 animate-pulse rounded-full bg-muted" />
        <div className="mb-5 h-12 w-full animate-pulse rounded-lg bg-muted" />
        <div className="mb-8 h-4 w-64 animate-pulse rounded bg-muted" />
        <div className="mb-10 aspect-video animate-pulse rounded-2xl bg-muted" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-full animate-pulse rounded bg-muted"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
