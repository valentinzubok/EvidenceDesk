export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="bg-orb bg-orb-teal animate-float absolute -left-32 top-20 h-96 w-96" />
      <div
        className="bg-orb bg-orb-violet animate-float absolute -right-24 top-1/3 h-80 w-80"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="bg-orb bg-orb-amber absolute bottom-0 left-1/3 h-72 w-72"
        style={{ animationDelay: "4s" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(45,212,191,0.12), transparent)",
        }}
      />
    </div>
  );
}
