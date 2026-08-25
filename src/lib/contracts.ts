import { REGISTRY_ADDRESS, SNAPSHOT_ADDRESS } from "./config";
import type { Address } from "./genlayer";
import { readContract, writeAndWait } from "./genlayer";
import type { CaseStats, EvidenceCase, TopTemplatesResponse } from "./types";
import { parseJson } from "./preview";

export async function listCaseIds(): Promise<string[]> {
  const raw = await readContract<string>(SNAPSHOT_ADDRESS, "list_cases", []);
  return parseJson<string[]>(raw, []);
}

export async function getCaseStats(): Promise<CaseStats | null> {
  const raw = await readContract<string>(SNAPSHOT_ADDRESS, "get_stats", []);
  return parseJson<CaseStats | null>(raw, null);
}

export async function getCase(caseId: string): Promise<EvidenceCase | null> {
  const raw = await readContract<string>(SNAPSHOT_ADDRESS, "get_case", [caseId]);
  const parsed = parseJson<EvidenceCase | null>(raw, null);
  return parsed?.case_id ? parsed : null;
}

export async function openCase(
  account: Address,
  provider: unknown,
  caseId: string,
  urlsJson: string,
): Promise<string> {
  return writeAndWait(account, provider, SNAPSHOT_ADDRESS, "open_case", [caseId, urlsJson]);
}

export async function crossCheckCase(
  account: Address,
  provider: unknown,
  caseId: string,
): Promise<string> {
  return writeAndWait(account, provider, SNAPSHOT_ADDRESS, "cross_check", [caseId]);
}

export async function listTopTemplates(limit = 20): Promise<TopTemplatesResponse> {
  const raw = await readContract<string>(REGISTRY_ADDRESS, "top", ["0", String(limit)]);
  return parseJson<TopTemplatesResponse>(raw, { items: [] });
}

export async function getCriteriaBody(templateId: string): Promise<string> {
  return readContract<string>(REGISTRY_ADDRESS, "get_body", [templateId]);
}
