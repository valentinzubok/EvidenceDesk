"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "./WalletProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/cases", label: "Cases" },
  { href: "/criteria", label: "Criteria" },
];

export function Nav() {
  const pathname = usePathname();
  const { address, connecting, connect, disconnect } = useWallet();

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold text-teal-400">
            Evidence Desk
          </Link>
          <nav className="flex gap-4 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={
                  pathname === l.href
                    ? "text-white"
                    : "text-zinc-400 hover:text-white"
                }
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
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
                Disconnect
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={connect}
              disabled={connecting}
              className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-500 disabled:opacity-50"
            >
              {connecting ? "Connecting…" : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
