"use client";

import { useCallback, useState } from "react";

type UseLoadingOptions = {
  initial?: boolean;
};

export function useLoading({ initial = false }: UseLoadingOptions = {}) {
  const [loading, setLoading] = useState(initial);
  const [label, setLabel] = useState("");

  const start = useCallback((nextLabel = "") => {
    setLabel(nextLabel);
    setLoading(true);
  }, []);

  const stop = useCallback(() => {
    setLoading(false);
    setLabel("");
  }, []);

  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>, nextLabel = ""): Promise<T> => {
      start(nextLabel);
      try {
        return await fn();
      } finally {
        stop();
      }
    },
    [start, stop],
  );

  return { loading, label, start, stop, setLabel, withLoading };
}
