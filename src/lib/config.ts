export const SNAPSHOT_ADDRESS = (process.env.NEXT_PUBLIC_SNAPSHOT_ADDRESS ??
  "0x356C408058cb82934eE6f62B14FC85D52858721a") as `0x${string}`;

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
  { id: "asimov", label: "Asimov", rpcLabel: "Testnet read-only", readOnly: true },
] as const;

export const DEFAULT_CHAIN = CHAINS[0];
