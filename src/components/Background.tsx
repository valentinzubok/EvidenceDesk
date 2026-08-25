export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="bg-orb bg-orb-teal animate-float absolute -left-32 top-20 h-96 w-96" />
      <div
        className="bg-orb bg-orb-violet animate-float absolute -right-24 top-1/3 h-80 w-80"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="bg-orb bg-orb-amber absolute bottom-0 left-1/3 h-72 w-72"
        style={{ animationDelay: "4s" }}
      />
      <div className="site-bg-glow absolute inset-0" />
    </div>
  );
}
