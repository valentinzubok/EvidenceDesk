"use client";

import useSWR, { mutate } from "swr";
import { useChain } from "@/components/ChainProvider";

const SWR_OPTS = { revalidateOnFocus: false, dedupingInterval: 30_000 };

export function useCaseIds() {
  const { adapter } = useChain();
  return useSWR(["genlayer:case-ids", adapter.id], () => adapter.listCases(), SWR_OPTS);
}

export function useCaseStats() {
  const { adapter } = useChain();
  return useSWR(
    adapter.getStats ? ["genlayer:case-stats", adapter.id] : null,
    () => adapter.getStats?.() ?? null,
    SWR_OPTS,
  );
}

export function useCase(caseId: string | null) {
  const { adapter } = useChain();
  return useSWR(
    caseId ? ["genlayer:case", adapter.id, caseId] : null,
    () => (caseId ? adapter.getCase(caseId) : null),
    SWR_OPTS,
  );
}

export function mutateCasesCache(chainId?: string) {
  const match = (key: unknown) => {
    if (!Array.isArray(key) || key[0] === undefined) return false;
    if (!String(key[0]).startsWith("genlayer:")) return false;
    if (chainId) return key[1] === chainId;
    return true;
  };
  void mutate(match, undefined, { revalidate: true });
}
