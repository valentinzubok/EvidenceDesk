"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEFAULT_CHAIN } from "@/lib/config";
import { useLocale } from "./LocaleProvider";
import { useWallet } from "./WalletProvider";

export function Nav() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useLocale();
  const { address, connecting, connect, disconnect, error } = useWallet();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/cases", label: t.nav.cases },
    { href: "/criteria", label: t.nav.criteria },
  ];

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/" className="text-lg font-semibold text-teal-400">
            Evidence Desk
          </Link>
          <nav className="flex gap-4 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={
                  pathname === l.href ? "text-white" : "text-zinc-400 hover:text-white"
                }
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
            {DEFAULT_CHAIN.label}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-zinc-700 p-0.5 text-xs">
            {(["en", "ru"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`rounded-md px-2 py-1 uppercase ${
                  locale === code ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {code}
              </button>
            ))}
          </div>
          {address ? (
            <>
              <span className="hidden font-mono text-xs text-zinc-400 sm:inline">
                {address.slice(0, 6)}…{address.slice(-4)}
              </span>
              <button
                type="button"
                onClick={disconnect}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:border-zinc-500"
              >
                {t.nav.disconnect}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={connect}
              disabled={connecting}
              className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-500 disabled:opacity-50"
            >
              {connecting ? t.nav.connecting : t.nav.connect}
            </button>
          )}
        </div>
      </div>
      {error ? (
        <p className="mx-auto max-w-6xl px-4 pb-3 text-sm text-amber-300" role="alert">
          {error}
        </p>
      ) : null}
    </header>
  );
}
