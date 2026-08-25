/** Shorten hex/hash for display: 0x7a3f…e9c2 */
export function shortHash(value: string, head = 6, tail = 4): string {
  const v = value.trim();
  if (v.length <= head + tail + 1) return v;
  if (v.startsWith("0x") && v.length > head + tail + 2) {
    return `${v.slice(0, head + 2)}…${v.slice(-tail)}`;
  }
  return `${v.slice(0, head)}…${v.slice(-tail)}`;
}

export type PaginatedResult<T> = {
  items: T[];
  nextCursor: string | null;
  total: number;
};

/** Client-side cursor pagination (chain returns full list). */
export function paginateWithCursor<T>(
  all: T[],
  cursor: string | null,
  limit: number,
  keyFn: (item: T) => string = (item) => String(item),
): PaginatedResult<T> {
  const start = cursor ? all.findIndex((item) => keyFn(item) === cursor) + 1 : 0;
  const from = start < 0 ? 0 : start;
  const items = all.slice(from, from + limit);
  const last = items[items.length - 1];
  const nextCursor = from + limit < all.length && last ? keyFn(last) : null;
  return { items, nextCursor, total: all.length };
}
