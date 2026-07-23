export function OfficeMap({ className = "" }: { className?: string }) {
  const address =
    "14 Obiwale Road, By Market Junction, Rumuigbo, Port Harcourt, Rivers State";
  const src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border ${className}`}>
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: "320px" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="OurSurePlug office location"
      />
    </div>
  );
}
