export const SNAPSHOT_ADDRESS =
  (process.env.NEXT_PUBLIC_SNAPSHOT_ADDRESS ??
    "0x356C408058cb82934eE6f62B14FC85D52858721a") as `0x${string}`;

export const REGISTRY_ADDRESS =
  (process.env.NEXT_PUBLIC_REGISTRY_ADDRESS ??
    "0xc62eC7D0133867b33f50D7E9416D01A8Cc244DF3") as `0x${string}`;

export const DEMO_URL =
  "https://test-server.genlayer.com/static/genvm/hello.html";

export const EXPLORER_SNAPSHOT =
  "https://explorer-studio.genlayer.com/contracts/0x356C408058cb82934eE6f62B14FC85D52858721a";

export const EXPLORER_REGISTRY =
  "https://explorer-studio.genlayer.com/contracts/0xc62eC7D0133867b33f50D7E9416D01A8Cc244DF3";
