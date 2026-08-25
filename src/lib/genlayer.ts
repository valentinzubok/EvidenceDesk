import { createClient } from "genlayer-js";
import { studionet, testnetAsimov } from "genlayer-js/chains";
import type { CalldataEncodable } from "genlayer-js/types";
import { TransactionStatus } from "genlayer-js/types";
import type { ChainId } from "./chain/types";

export type Address = `0x${string}`;

type EthereumProvider = NonNullable<Parameters<typeof createClient>[0]>["provider"];

const CHAIN_MAP = {
  studionet,
  asimov: testnetAsimov,
} as const;

export type ReadChainId = keyof typeof CHAIN_MAP;

export function getChainForRead(id: ReadChainId | ChainId = "studionet") {
  if (id === "asimov") return testnetAsimov;
  return studionet;
}

export function getReadClient(chainId: ReadChainId | ChainId = "studionet") {
  return createClient({ chain: getChainForRead(chainId) });
}

export function getWriteClient(account: Address, provider: EthereumProvider, chainId: ReadChainId = "studionet") {
  return createClient({
    chain: getChainForRead(chainId),
    account,
    provider,
  });
}

export async function readContract<T = unknown>(
  address: Address,
  functionName: string,
  args: CalldataEncodable[] = [],
  chainId: ReadChainId | ChainId = "studionet",
): Promise<T> {
  const client = getReadClient(chainId);
  return client.readContract({
    address,
    functionName,
    args,
  }) as Promise<T>;
}

export async function writeAndWait(
  account: Address,
  provider: unknown,
  address: Address,
  functionName: string,
  args: CalldataEncodable[] = [],
  network: "studionet" | "testnetAsimov" = "studionet",
): Promise<string> {
  const client = getWriteClient(account, provider as EthereumProvider);
  await client.connect(network);
  const hash = await client.writeContract({
    address,
    functionName,
    args,
    value: BigInt(0),
  });
  await client.waitForTransactionReceipt({
    hash,
    status: TransactionStatus.ACCEPTED,
  });
  return hash;
}
