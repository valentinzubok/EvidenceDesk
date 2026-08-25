"use client";

import useSWR, { mutate } from "swr";
import { getCase, getCaseStats, listCaseIds } from "@/lib/contracts";

const SWR_OPTS = { revalidateOnFocus: false, dedupingInterval: 30_000 };

export function useCaseIds() {
  return useSWR("genlayer:case-ids", listCaseIds, SWR_OPTS);
}

export function useCaseStats() {
  return useSWR("genlayer:case-stats", getCaseStats, SWR_OPTS);
}

export function useCase(caseId: string | null) {
  return useSWR(
    caseId ? `genlayer:case:${caseId}` : null,
    () => (caseId ? getCase(caseId) : null),
    SWR_OPTS,
  );
}

export function mutateCasesCache() {
  void mutate("genlayer:case-ids");
  void mutate("genlayer:case-stats");
}
