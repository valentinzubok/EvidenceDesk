import type { Address } from "./genlayer";

export type CaseItem = {
  url: string;
  content_hash: string;
  preview: string;
  status: string;
};

export type EvidenceCase = {
  case_id: string;
  tampered?: boolean;
  has_ok_snapshot?: boolean;
  items?: CaseItem[];
};

export type CaseStats = {
  cases: number;
  tampered: number;
  clean: number;
};

export type CriteriaTemplate = {
  id: string;
  title: string;
  score: number;
  uses: number;
  tags?: string[];
};

export type TopTemplatesResponse = {
  items: CriteriaTemplate[];
};

export type ChainConfig = {
  id: string;
  label: string;
  rpcLabel: string;
};

export type WalletState = {
  address: Address | null;
  connecting: boolean;
  provider: unknown | null;
};
