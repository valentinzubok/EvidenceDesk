export const SNAPSHOT_ADDRESS = (process.env.NEXT_PUBLIC_SNAPSHOT_ADDRESS ??
  "0x356C408058cb82934eE6f62B14FC85D52858721a") as `0x${string}`;

/**
 * EvidenceSnapshot v2 on Studio Dev (chain 61997). v2 keeps the freeze and adds the
 * verdict v1 could not give: for the URLs whose bytes drifted, validators judge whether
 * the change altered the answer to the case question, so cosmetic and material drift stop
 * looking the same. Source: contracts/EvidenceSnapshotV2.py, hash-checked in CI.
 */
export const SNAPSHOT_V2_ADDRESS = (process.env.NEXT_PUBLIC_SNAPSHOT_V2_ADDRESS ??
  "0xe5a428bC4A6cbd8E61e31C923C9703f5c1bA0047") as `0x${string}`;

export const STUDIO_DEV_CHAIN_ID = 61997;
export const STUDIO_DEV_RPC =
  process.env.NEXT_PUBLIC_STUDIO_DEV_RPC ?? "https://studio-dev.genlayer.com/api";
export const EXPLORER_SNAPSHOT_V2 =
  "https://explorer-studio-dev.genlayer.com/address/0xe5a428bC4A6cbd8E61e31C923C9703f5c1bA0047";

export const REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_REGISTRY_ADDRESS ??
  "0xc62eC7D0133867b33f50D7E9416D01A8Cc244DF3") as `0x${string}`;

/** Testnet Asimov EvidenceSnapshot (read-only demo). Override when deployed. */
export const ASIMOV_SNAPSHOT_ADDRESS = (process.env.NEXT_PUBLIC_ASIMOV_SNAPSHOT_ADDRESS ??
  SNAPSHOT_ADDRESS) as `0x${string}`;

export const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}` | undefined;
export const RBAC_ADDRESS = process.env.NEXT_PUBLIC_RBAC_ADDRESS as `0x${string}` | undefined;

export const LIVE_APP_URL = "https://evidence-desk-chi.valandelon.com";

export const DEMO_URL = "https://test-server.genlayer.com/static/genvm/hello.html";

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const ANALYTICS_URL = process.env.NEXT_PUBLIC_ANALYTICS_URL ?? "";

export const EXPLORER_SNAPSHOT =
  "https://explorer-studio.genlayer.com/contracts/0x356C408058cb82934eE6f62B14FC85D52858721a";

export const EXPLORER_REGISTRY =
  "https://explorer-studio.genlayer.com/contracts/0xc62eC7D0133867b33f50D7E9416D01A8Cc244DF3";

export const EXPLORER_ASIMOV = "https://explorer-asimov.genlayer.com/";

export const CHAINS = [
  { id: "studionet", label: "Studionet", rpcLabel: "GenLayer Studio", readOnly: false },
  {
    id: "studio-dev",
    label: "Studio Dev",
    rpcLabel: "Studio Dev (61997) — EvidenceSnapshot v2",
    readOnly: false,
  },
  { id: "asimov", label: "Asimov", rpcLabel: "Testnet read-only", readOnly: true },
] as const;

export const DEFAULT_CHAIN = CHAINS[0];
