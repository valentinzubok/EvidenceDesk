import { ASIMOV_SNAPSHOT_ADDRESS, SNAPSHOT_ADDRESS } from "../config";
import { getCase, getCaseStats, listCaseIds } from "../contracts";
import { readContract } from "../genlayer";
import type { CaseStats, EvidenceCase } from "../types";
import { parseJson } from "../preview";
import type { ChainAdapter, ChainId } from "./types";

async function listAsimovCases(): Promise<string[]> {
  const raw = await readContract<string>(ASIMOV_SNAPSHOT_ADDRESS, "list_cases", [], "asimov");
  return parseJson<string[]>(raw, []);
}

async function getAsimovCase(id: string): Promise<EvidenceCase | null> {
  const raw = await readContract<string>(ASIMOV_SNAPSHOT_ADDRESS, "get_case", [id], "asimov");
  const parsed = parseJson<EvidenceCase | null>(raw, null);
  return parsed?.case_id ? parsed : null;
}

async function getAsimovStats(): Promise<CaseStats | null> {
  try {
    const raw = await readContract<string>(ASIMOV_SNAPSHOT_ADDRESS, "get_stats", [], "asimov");
    return parseJson<CaseStats | null>(raw, null);
  } catch {
    return null;
  }
}

function studionetAdapter(): ChainAdapter {
  return {
    id: "studionet",
    label: "Studionet",
    available: true,
    readOnly: false,
    snapshotAddress: SNAPSHOT_ADDRESS,
    listCases: listCaseIds,
    getCase,
    getStats: getCaseStats,
  };
}

function asimovAdapter(): ChainAdapter {
  return {
    id: "asimov",
    label: "Asimov (read-only)",
    available: true,
    readOnly: true,
    snapshotAddress: ASIMOV_SNAPSHOT_ADDRESS,
    listCases: listAsimovCases,
    getCase: getAsimovCase,
    getStats: getAsimovStats,
  };
}

function placeholderAdapter(id: ChainId, label: string): ChainAdapter {
  return {
    id,
    label,
    available: false,
    readOnly: true,
    listCases: async () => [],
    getCase: async () => null,
  };
}

const adapters: Record<ChainId, ChainAdapter> = {
  studionet: studionetAdapter(),
  asimov: asimovAdapter(),
  polkadot: placeholderAdapter("polkadot", "Polkadot"),
  solana: placeholderAdapter("solana", "Solana"),
};

export function getChainAdapter(id: ChainId): ChainAdapter {
  return adapters[id];
}

export function listChains(): ChainAdapter[] {
  return Object.values(adapters);
}

export function getActiveChainId(): ChainId {
  const env = process.env.NEXT_PUBLIC_CHAIN ?? "studionet";
  if (env in adapters) return env as ChainId;
  return "studionet";
}
