"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEFAULT_CHAIN, LIVE_APP_URL } from "@/lib/config";
import { useLocale } from "./LocaleProvider";
import { useWallet } from "./WalletProvider";
import { useTheme } from "./ThemeProvider";
import { useRole } from "./RoleProvider";
import { useChain } from "./ChainProvider";
import { WalletButton } from "./WalletButton";
import { ROLE_LABELS, type Role } from "@/lib/rbac";

export function Nav() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { address } = useWallet();
  const { role, setUserRole } = useRole();
  const { chainId, chains, setChainId } = useChain();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/cases", label: t.nav.cases },
    { href: "/criteria", label: t.nav.criteria },
    { href: "/marketplace", label: t.nav.marketplace },
  ];

  return (
    <header className="site-header sticky top-0 z-40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/" className="group flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-teal-700 text-sm font-bold text-zinc-950 shadow-lg shadow-teal-500/20">
              ED
            </span>
            <span className="text-base font-semibold text-white group-hover:text-teal-300 transition-colors">
              Evidence Desk
            </span>
          </Link>
          <nav className="flex gap-1 text-sm">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-lg px-3 py-1.5 transition-colors ${
                    active ? "nav-link-active bg-white/5" : "nav-link hover:bg-white/5"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="chain-badge hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            {DEFAULT_CHAIN.label}
          </span>

          {!address ? (
            <span className="badge-neutral hidden sm:inline">{t.nav.readOnly}</span>
          ) : null}

          <button
            type="button"
            onClick={toggleTheme}
            className="btn-icon"
            title={theme === "dark" ? t.theme.light : t.theme.dark}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>

          <div className="locale-switch flex rounded-lg p-0.5 text-xs">
            {(["en", "ua"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`rounded-md px-2.5 py-1 uppercase transition-all ${
                  locale === code ? "bg-teal-600/80 text-white shadow-sm" : "nav-link"
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          <a
            href={LIVE_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon hidden md:inline-flex"
          >
            ↗
          </a>

          <select
            value={chainId}
            onChange={(e) => setChainId(e.target.value as typeof chainId)}
            className="btn-icon hidden sm:inline-flex !py-1.5 text-[10px] uppercase"
            title="Chain"
          >
            {chains
              .filter((c) => c.available)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
          </select>

          <select
            value={role}
            onChange={(e) => setUserRole(e.target.value as Role)}
            className="btn-icon hidden sm:inline-flex !py-1.5 text-[10px] uppercase"
            title={t.rbac.role}
          >
            {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>

          <WalletButton />
        </div>
      </div>
    </header>
  );
}
