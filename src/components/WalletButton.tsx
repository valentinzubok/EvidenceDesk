"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "./LocaleProvider";
import { Tooltip } from "./ui/Tooltip";
import { useErrorToast } from "./ErrorToast";
import { useToast } from "./ToastProvider";
import { useWallet } from "./WalletProvider";

const METAMASK_URL = "https://metamask.io/download/";

export function WalletButton() {
  const { t } = useLocale();
  const { push } = useToast();
  const pushError = useErrorToast();
  const {
    address,
    status,
    connecting,
    connect,
    disconnect,
    copyAddress,
    shortAddress,
    hasMetaMask,
    studionetReady,
    error,
  } = useWallet();
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (error && !address) pushError(new Error(error), "wallet");
  }, [error, address, pushError]);

  const handleConnect = useCallback(async () => {
    if (!hasMetaMask) {
      setShowModal(true);
      return;
    }
    const ok = await connect();
    if (ok) push(t.nav.connected, "ok");
  }, [hasMetaMask, connect, push, t.nav.connected]);

  const handleCopy = useCallback(async () => {
    const ok = await copyAddress();
    push(ok ? t.nav.copied : t.common.error, ok ? "ok" : "warn");
  }, [copyAddress, push, t.nav.copied, t.common.error]);

  if (address) {
    return (
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="btn-ghost !py-2 !px-3 gap-2"
        >
          <span className={studionetReady ? "wallet-dot-connected" : "wallet-dot-disconnected"} />
          <span className="font-mono text-xs sm:text-sm">{shortAddress}</span>
          <span className="text-zinc-500">▾</span>
        </button>
        {open ? (
          <div className="dropdown-panel absolute right-0 top-full z-50 mt-2 w-56 animate-fade-up rounded-xl p-2 backdrop-blur-xl">
            <p className="px-2 py-1 text-[10px] uppercase tracking-wide text-zinc-500">
              {studionetReady ? t.nav.connected : t.common.loading}
            </p>
            <p className="px-2 pb-2 font-mono text-xs text-zinc-300 break-all">{address}</p>
            <button
              type="button"
              onClick={handleCopy}
              className="btn-icon w-full justify-start !rounded-lg"
            >
              {t.nav.copyAddress}
            </button>
            <button
              type="button"
              onClick={() => {
                disconnect();
                setOpen(false);
              }}
              className="btn-icon mt-1 w-full justify-start !rounded-lg text-red-300 hover:border-red-500/40"
            >
              {t.nav.disconnect}
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <Tooltip label={t.tooltips.wallet}>
        <button
          type="button"
          onClick={handleConnect}
          disabled={connecting || status === "connecting"}
          className="btn-primary !py-2 !px-4"
        >
          {connecting ? t.nav.connecting : t.nav.connect}
        </button>
      </Tooltip>
      {showModal ? <WalletModal onClose={() => setShowModal(false)} /> : null}
      {error && !address ? <span className="sr-only">{error}</span> : null}
    </>
  );
}

function WalletModal({ onClose }: { onClose: () => void }) {
  const { t } = useLocale();

  return (
    <div
      className="overlay-backdrop fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal
    >
      <div className="glass-card max-w-md w-full animate-fade-up space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">{t.wallet.title}</h2>
          <button type="button" onClick={onClose} className="btn-icon !border-0">
            ✕
          </button>
        </div>
        <p className="text-sm text-zinc-400">{t.wallet.noMetaMask}</p>
        <ol className="space-y-2 text-sm text-zinc-400">
          <li className="flex gap-2">
            <span className="badge-neutral shrink-0">1</span>
            {t.wallet.step1}
          </li>
          <li className="flex gap-2">
            <span className="badge-neutral shrink-0">2</span>
            {t.wallet.step2}
          </li>
          <li className="flex gap-2">
            <span className="badge-neutral shrink-0">3</span>
            {t.wallet.step3}
          </li>
        </ol>
        <p className="text-xs text-teal-400/80">{t.wallet.studionet}</p>
        <div className="flex gap-2 pt-2">
          <a
            href={METAMASK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex-1 text-center"
          >
            {t.wallet.install}
          </a>
          <button type="button" onClick={onClose} className="btn-ghost">
            {t.common.retry}
          </button>
        </div>
      </div>
    </div>
  );
}
