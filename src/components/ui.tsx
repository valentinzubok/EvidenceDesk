export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-400" role="status">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-teal-400" />
      {label ? <span>{label}</span> : null}
    </div>
  );
}

export function Alert({ message, tone = "warn" }: { message: string; tone?: "warn" | "ok" }) {
  if (!message) return null;
  const cls =
    tone === "ok"
      ? "border-emerald-800 bg-emerald-950/40 text-emerald-200"
      : "border-amber-800 bg-amber-950/40 text-amber-200";
  return (
    <p className={`rounded-lg border px-3 py-2 text-sm break-all ${cls}`} role="alert">
      {message}
    </p>
  );
}

export function LoadingOverlay({ show, label }: { show: boolean; label?: string }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
      <div className="card flex items-center gap-3">
        <Spinner label={label} />
      </div>
    </div>
  );
}
