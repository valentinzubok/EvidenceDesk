import { FACTORY_ADDRESS, RBAC_ADDRESS, SNAPSHOT_ADDRESS } from "./config";
import type { Address } from "./genlayer";
import { readContract, writeAndWait } from "./genlayer";
import { parseJson } from "./preview";
import type { Role } from "./rbac";

const ROLE_MAP: Record<number, Role> = {
  0: "viewer",
  1: "moderator",
  2: "admin",
};

export async function getOnChainRole(account: Address): Promise<Role | null> {
  if (!RBAC_ADDRESS) return null;
  try {
    const raw = await readContract<string>(RBAC_ADDRESS, "get_role", [account]);
    const n = Number(parseJson<number>(raw, 0));
    return ROLE_MAP[n] ?? "viewer";
  } catch {
    return null;
  }
}

export async function batchOpenCases(
  account: Address,
  provider: unknown,
  payloads: { caseId: string; urlsJson: string }[],
): Promise<string> {
  const batchJson = JSON.stringify(payloads);
  return writeAndWait(account, provider, SNAPSHOT_ADDRESS, "batch_open_cases", [batchJson]);
}

export async function createDeskViaFactory(
  account: Address,
  provider: unknown,
  deskName: string,
): Promise<string> {
  if (!FACTORY_ADDRESS) {
    throw new Error("FACTORY_ADDRESS not configured — deploy EvidenceDeskFactory first");
  }
  return writeAndWait(account, provider, FACTORY_ADDRESS, "create_desk", [deskName]);
}

export async function listFactoryDesks(): Promise<string[]> {
  if (!FACTORY_ADDRESS) return [];
  const raw = await readContract<string>(FACTORY_ADDRESS, "list_desks", []);
  return parseJson<string[]>(raw, []);
}
