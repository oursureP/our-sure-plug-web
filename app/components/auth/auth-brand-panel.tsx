export function AuthBrandPanel({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex"
      style={{ backgroundColor: "var(--brand-purple)" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 top-0 h-full w-48 opacity-[0.12]"
        style={{
          background:
            "repeating-linear-gradient(115deg, var(--brand-green) 0 2px, transparent 2px 24px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle, var(--brand-green), transparent 70%)",
        }}
      />
      <div className="relative" />
      <div className="relative">
        <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-white">
          {title}
        </h1>
        <p className="max-w-md text-[15px] leading-relaxed text-white/75">
          {subtitle}
        </p>
      </div>
      <div className="relative text-[13px] text-white/50">
        © {new Date().getFullYear()} OurSurePlug. All rights reserved.
      </div>
    </div>
  );
}
