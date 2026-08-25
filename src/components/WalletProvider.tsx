"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatWalletError } from "@/lib/errors";
import type { Address } from "@/lib/genlayer";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

type WalletContextValue = {
  address: Address | null;
  connecting: boolean;
  error: string;
  clearError: () => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  provider: EthereumProvider | null;
};

const WalletContext = createContext<WalletContextValue | null>(null);

function getEthereum(): EthereumProvider | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { ethereum?: EthereumProvider }).ethereum;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<Address | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState<EthereumProvider | null>(null);

  const clearError = useCallback(() => setError(""), []);

  const connect = useCallback(async () => {
    const eth = getEthereum();
    if (!eth) {
      setError("MetaMask not found. Install MetaMask to send transactions.");
      return;
    }
    setConnecting(true);
    setError("");
    try {
      const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
      if (accounts[0]) {
        setAddress(accounts[0] as Address);
        setProvider(eth);
      }
    } catch (e) {
      setError(formatWalletError(e));
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setProvider(null);
    setError("");
  }, []);

  useEffect(() => {
    const eth = getEthereum();
    if (!eth) return;
    eth.request({ method: "eth_accounts" })
      .then((accounts) => {
        const list = accounts as string[];
        if (list[0]) {
          setAddress(list[0] as Address);
          setProvider(eth);
        }
      })
      .catch((e) => console.error("[EvidenceDesk] eth_accounts:", e));
  }, []);

  const value = useMemo(
    () => ({ address, connecting, error, clearError, connect, disconnect, provider }),
    [address, connecting, error, clearError, connect, disconnect, provider],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
