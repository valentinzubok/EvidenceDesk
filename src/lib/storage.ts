const RECENT_KEY = "evidence-desk:recent-cases";
const FAVORITES_KEY = "evidence-desk:favorite-cases";
const MAX_RECENT = 12;

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function writeList(key: string, ids: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(ids));
}

export function getRecentCases(): string[] {
  return readList(RECENT_KEY);
}

export function getFavoriteCases(): string[] {
  return readList(FAVORITES_KEY);
}

export function touchRecentCase(caseId: string): string[] {
  const trimmed = caseId.trim();
  if (!trimmed) return getRecentCases();
  const next = [trimmed, ...getRecentCases().filter((id) => id !== trimmed)].slice(0, MAX_RECENT);
  writeList(RECENT_KEY, next);
  return next;
}

export function toggleFavoriteCase(caseId: string): { favorites: string[]; added: boolean } {
  const trimmed = caseId.trim();
  const current = getFavoriteCases();
  const exists = current.includes(trimmed);
  const favorites = exists ? current.filter((id) => id !== trimmed) : [trimmed, ...current];
  writeList(FAVORITES_KEY, favorites);
  return { favorites, added: !exists };
}

export function isFavoriteCase(caseId: string): boolean {
  return getFavoriteCases().includes(caseId);
}
