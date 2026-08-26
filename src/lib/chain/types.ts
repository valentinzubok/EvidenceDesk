import type { Address } from "../genlayer";
import type { CaseStats, EvidenceCase } from "../types";

export type ChainId = "studionet" | "asimov" | "polkadot" | "solana";

export type ChainAdapter = {
  id: ChainId;
  label: string;
  available: boolean;
  readOnly?: boolean;
  snapshotAddress?: Address;
  listCases: () => Promise<string[]>;
  getCase: (id: string) => Promise<EvidenceCase | null>;
  getStats?: () => Promise<CaseStats | null>;
};

export type ChainRegistry = Record<ChainId, ChainAdapter>;
