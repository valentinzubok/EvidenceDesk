import { MAX_URLS_PER_CASE } from "./limits";

const CASE_ID_RE = /^[a-zA-Z0-9_-]{1,64}$/;
const HTTPS_URL_RE = /^https:\/\/[^\s<>"']+$/i;

export type UrlValidationError =
  "invalid_json" | "empty_array" | "too_many_urls" | "not_string" | "https_only" | "url_too_long";

export function sanitizeCaseId(raw: string): string {
  return raw.trim().slice(0, 64);
}

export function isValidCaseId(id: string): boolean {
  return CASE_ID_RE.test(id.trim());
}

export function parseUrlsJson(
  raw: string,
): { ok: true; urls: string[] } | { ok: false; error: UrlValidationError } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.trim());
  } catch {
    return { ok: false, error: "invalid_json" };
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    return { ok: false, error: "empty_array" };
  }
  if (parsed.length > MAX_URLS_PER_CASE) {
    return { ok: false, error: "too_many_urls" };
  }
  const urls: string[] = [];
  for (const item of parsed) {
    if (typeof item !== "string") return { ok: false, error: "not_string" };
    const url = item.trim();
    if (!HTTPS_URL_RE.test(url)) return { ok: false, error: "https_only" };
    if (url.length > 2048) return { ok: false, error: "url_too_long" };
    urls.push(url);
  }
  return { ok: true, urls };
}

export function escapeDisplay(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
