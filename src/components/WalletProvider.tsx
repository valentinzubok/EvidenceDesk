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
import type { Address } from "@/lib/genlayer";

type WalletContextValue = {
  address: Address | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  provider: unknown | null;
};

const WalletContext = createContext<WalletContextValue | null>(null);

function getEthereum(): { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<Address | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [provider, setProvider] = useState<unknown | null>(null);

  const connect = useCallback(async () => {
    const eth = getEthereum();
    if (!eth) {
      alert("MetaMask not found. Install MetaMask to send transactions.");
      return;
    }
    setConnecting(true);
    try {
      const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
      if (accounts[0]) {
        setAddress(accounts[0] as Address);
        setProvider(eth);
      }
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setProvider(null);
  }, []);

  useEffect(() => {
    const eth = getEthereum();
    if (!eth) return;
    eth.request({ method: "eth_accounts" }).then((accounts) => {
      const list = accounts as string[];
      if (list[0]) {
        setAddress(list[0] as Address);
        setProvider(eth);
      }
    });
  }, []);

  const value = useMemo(
    () => ({ address, connecting, connect, disconnect, provider }),
    [address, connecting, connect, disconnect, provider],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
