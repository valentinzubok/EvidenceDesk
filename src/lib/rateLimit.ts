const KEY_PREFIX = "evidence-desk:open-case:";
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

export function canOpenCase(address: string): { allowed: boolean; retryAfterSec: number } {
  if (typeof window === "undefined") return { allowed: true, retryAfterSec: 0 };
  const key = `${KEY_PREFIX}${address.toLowerCase()}`;
  try {
    const raw = localStorage.getItem(key);
    const now = Date.now();
    const timestamps: number[] = raw ? (JSON.parse(raw) as number[]) : [];
    const recent = timestamps.filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) {
      const oldest = recent[0] ?? now;
      return { allowed: false, retryAfterSec: Math.ceil((WINDOW_MS - (now - oldest)) / 1000) };
    }
    return { allowed: true, retryAfterSec: 0 };
  } catch {
    return { allowed: true, retryAfterSec: 0 };
  }
}

export function recordOpenCase(address: string): void {
  if (typeof window === "undefined") return;
  const key = `${KEY_PREFIX}${address.toLowerCase()}`;
  const now = Date.now();
  try {
    const raw = localStorage.getItem(key);
    const timestamps: number[] = raw ? (JSON.parse(raw) as number[]) : [];
    const recent = [...timestamps.filter((t) => now - t < WINDOW_MS), now];
    localStorage.setItem(key, JSON.stringify(recent));
  } catch {
    /* ignore */
  }
}
