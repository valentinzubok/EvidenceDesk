"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getChainAdapter, getActiveChainId, listChains } from "@/lib/chain/chainService";
import type { ChainAdapter, ChainId } from "@/lib/chain/types";

const STORAGE_KEY = "evidence-desk:chain";

type ChainContextValue = {
  chainId: ChainId;
  adapter: ChainAdapter;
  chains: ChainAdapter[];
  setChainId: (id: ChainId) => void;
};

const ChainContext = createContext<ChainContextValue | null>(null);

export function ChainProvider({ children }: { children: ReactNode }) {
  const [chainId, setChainIdState] = useState<ChainId>(getActiveChainId());

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ChainId | null;
    if (saved && listChains().some((c) => c.id === saved && c.available)) {
      setChainIdState(saved);
    }
  }, []);

  const setChainId = useCallback((id: ChainId) => {
    setChainIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const adapter = getChainAdapter(chainId);
  const value = useMemo(
    () => ({ chainId, adapter, chains: listChains(), setChainId }),
    [chainId, adapter, setChainId],
  );

  return <ChainContext.Provider value={value}>{children}</ChainContext.Provider>;
}

export function useChain() {
  const ctx = useContext(ChainContext);
  if (!ctx) throw new Error("useChain must be used within ChainProvider");
  return ctx;
}
