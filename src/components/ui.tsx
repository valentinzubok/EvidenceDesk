import type { ReactNode } from "react";

export function Spinner({ label, size = "md" }: { label?: string; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <div className="flex items-center gap-2.5 text-sm text-zinc-400" role="status">
      <span className={`inline-block ${dim} spinner-ring animate-spin rounded-full border-2`} />
      {label ? <span>{label}</span> : null}
    </div>
  );
}

export function Alert({
  message,
  tone = "warn",
}: {
  message: string;
  tone?: "warn" | "ok" | "info";
}) {
  if (!message) return null;
  const cls =
    tone === "ok" ? "alert alert-ok" : tone === "info" ? "alert alert-info" : "alert alert-warn";
  return (
    <p className={`${cls} rounded-xl px-4 py-3 text-sm break-all backdrop-blur-sm`} role="alert">
      {message}
    </p>
  );
}

export function LoadingOverlay({ show, label }: { show: boolean; label?: string }) {
  if (!show) return null;
  return (
    <div className="overlay-backdrop fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="glass-card flex flex-col items-center gap-4 px-8 py-6">
        <div className="relative">
          <span className="spinner-ring inline-block h-10 w-10 animate-spin rounded-full border-2" />
          <span className="absolute inset-0 rounded-full blur-md bg-teal-400/20" />
        </div>
        {label ? <p className="text-sm text-zinc-300">{label}</p> : null}
      </div>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <header className="animate-fade-up space-y-3 pb-2">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-400/90">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="gradient-text text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {subtitle ? (
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">{subtitle}</p>
      ) : null}
      {children}
    </header>
  );
}

export function GlassCard({
  children,
  className = "",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div className={`glass-card ${interactive ? "glass-card-interactive" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  tone?: "ok" | "bad" | "neutral";
}) {
  const border =
    tone === "ok"
      ? "border-emerald-500/25"
      : tone === "bad"
        ? "border-red-500/25"
        : "border-white/10";
  return (
    <div className={`glass-card ${border} min-w-[120px] flex-1`}>
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-white">{value}</p>
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
        ⌕
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
        maxLength={128}
      />
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="h-12 w-12 rounded-full border border-dashed border-zinc-700 flex items-center justify-center text-zinc-600 text-xl">
        ∅
      </div>
      <p className="text-sm text-zinc-500">{message}</p>
    </div>
  );
}
