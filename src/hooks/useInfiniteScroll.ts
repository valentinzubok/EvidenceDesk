"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useInfiniteScroll<T>(
  allItems: T[],
  pageSize = 15,
): {
  visible: T[];
  hasMore: boolean;
  loadMore: () => void;
  sentinelRef: (node: HTMLElement | null) => void;
  reset: () => void;
} {
  const [count, setCount] = useState(pageSize);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setCount(pageSize);
  }, [allItems, pageSize]);

  const visible = allItems.slice(0, count);
  const hasMore = count < allItems.length;

  const loadMore = useCallback(() => {
    setCount((c) => Math.min(c + pageSize, allItems.length));
  }, [allItems.length, pageSize]);

  const reset = useCallback(() => setCount(pageSize), [pageSize]);

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      observerRef.current?.disconnect();
      if (!node || !hasMore) return;
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) loadMore();
        },
        { rootMargin: "120px" },
      );
      observerRef.current.observe(node);
    },
    [hasMore, loadMore],
  );

  return { visible, hasMore, loadMore, sentinelRef, reset };
}
