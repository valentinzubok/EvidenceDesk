"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { formatWalletError } from "@/lib/errors";
import type { Locale } from "@/lib/i18n/messages";
import type { Address } from "@/lib/genlayer";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
};

export type WalletStatus = "disconnected" | "connecting" | "connected";

type WalletContextValue = {
  address: Address | null;
  status: WalletStatus;
  connecting: boolean;
  error: string;
  hasMetaMask: boolean;
  studionetReady: boolean;
  clearError: () => void;
  connect: () => Promise<{ address: Address; provider: EthereumProvider } | null>;
  disconnect: () => void;
  provider: EthereumProvider | null;
  copyAddress: () => Promise<boolean>;
  shortAddress: string | null;
};

const WalletContext = createContext<WalletContextValue | null>(null);

function getEthereum(): EthereumProvider | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { ethereum?: EthereumProvider }).ethereum;
}

async function ensureStudionet(provider: EthereumProvider, account: Address): Promise<boolean> {
  try {
    const client = createClient({ chain: studionet, account, provider });
    await client.connect("studionet");
    return true;
  } catch (e) {
    console.error("[EvidenceDesk] studionet connect:", e);
    return false;
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<Address | null>(null);
  const [status, setStatus] = useState<WalletStatus>("disconnected");
  const [error, setError] = useState("");
  const [provider, setProvider] = useState<EthereumProvider | null>(null);
  const [studionetReady, setStudionetReady] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const localeRef = useRef<Locale>("en");

  useEffect(() => {
    setHasMetaMask(Boolean(getEthereum()?.isMetaMask ?? getEthereum()));
  }, []);

  const clearError = useCallback(() => setError(""), []);

  const bindAccount = useCallback(async (eth: EthereumProvider, acc: string, loc: Locale) => {
    const typed = acc as Address;
    setAddress(typed);
    setProvider(eth);
    setStatus("connected");
    const ready = await ensureStudionet(eth, typed);
    setStudionetReady(ready);
    if (!ready) {
      setError(
        loc === "ua"
          ? "Studionet не підключено. Спробуйте ще раз."
          : "Studionet not connected. Try again.",
      );
    }
  }, []);

  const connect = useCallback(async (): Promise<{
    address: Address;
    provider: EthereumProvider;
  } | null> => {
    const eth = getEthereum();
    const loc = localeRef.current;
    if (!eth) {
      setError(formatWalletError(new Error("MetaMask not found"), loc));
      return null;
    }
    setStatus("connecting");
    setError("");
    try {
      const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
      if (!accounts[0]) {
        setStatus("disconnected");
        return null;
      }
      const typed = accounts[0] as Address;
      await bindAccount(eth, typed, loc);
      return { address: typed, provider: eth };
    } catch (e) {
      setStatus("disconnected");
      setError(formatWalletError(e, loc));
      return null;
    }
  }, [bindAccount]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setProvider(null);
    setStudionetReady(false);
    setStatus("disconnected");
    setError("");
  }, []);

  const copyAddress = useCallback(async (): Promise<boolean> => {
    if (!address) return false;
    try {
      await navigator.clipboard.writeText(address);
      return true;
    } catch {
      return false;
    }
  }, [address]);

  useEffect(() => {
    const saved = localStorage.getItem("evidence-desk:locale");
    if (saved === "ua" || saved === "uk" || saved === "ru") localeRef.current = "ua";
  }, []);

  useEffect(() => {
    const eth = getEthereum();
    if (!eth) return;

    const onAccounts = (accounts: unknown) => {
      const list = accounts as string[];
      if (list[0]) {
        void bindAccount(eth, list[0], localeRef.current);
      } else {
        disconnect();
      }
    };

    const onChain = () => {
      if (address && eth) void ensureStudionet(eth, address).then(setStudionetReady);
    };

    eth.request({ method: "eth_accounts" })
      .then((accounts) => {
        const list = accounts as string[];
        if (list[0]) void bindAccount(eth, list[0], localeRef.current);
      })
      .catch((e) => console.error("[EvidenceDesk] eth_accounts:", e));

    eth.on?.("accountsChanged", onAccounts);
    eth.on?.("chainChanged", onChain);

    return () => {
      eth.removeListener?.("accountsChanged", onAccounts);
      eth.removeListener?.("chainChanged", onChain);
    };
  }, [address, bindAccount, disconnect]);

  const shortAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : null;

  const value = useMemo(
    () => ({
      address,
      status,
      connecting: status === "connecting",
      error,
      hasMetaMask,
      studionetReady,
      clearError,
      connect,
      disconnect,
      provider,
      copyAddress,
      shortAddress,
    }),
    [
      address,
      status,
      error,
      hasMetaMask,
      studionetReady,
      clearError,
      connect,
      disconnect,
      provider,
      copyAddress,
      shortAddress,
    ],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
