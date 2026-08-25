export function markdownPreview(text: string, maxLen = 140): string {
  const plain = text
    .replace(/^#+\s+/gm, "")
    .replace(/[*_`>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen).trim()}…`;
}

export function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw || "null") as T;
  } catch {
    return fallback;
  }
}
