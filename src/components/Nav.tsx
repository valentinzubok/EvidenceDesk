"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DEFAULT_CHAIN } from "@/lib/config";
import { useLocale } from "./LocaleProvider";
import { useWallet } from "./WalletProvider";
import { useTheme } from "./ThemeProvider";
import { useRole } from "./RoleProvider";
import { useChain } from "./ChainProvider";
import { WalletButton } from "./WalletButton";
import { ROLE_LABELS, type Role } from "@/lib/rbac";

const NAV_ICONS: Record<string, string> = {
  "/": "⌂",
  "/cases": "◫",
  "/criteria": "☰",
  "/marketplace": "◈",
};

export function Nav() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { address } = useWallet();
  const { role, setUserRole } = useRole();
  const { chainId, chains, setChainId } = useChain();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/cases", label: t.nav.cases },
    { href: "/criteria", label: t.nav.criteria },
    { href: "/marketplace", label: t.nav.marketplace },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toolbar = (
    <>
      <span className="chain-badge hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide lg:inline-flex">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
        {DEFAULT_CHAIN.label}
      </span>

      {!address ? (
        <span className="badge-neutral hidden xl:inline">{t.nav.readOnly}</span>
      ) : null}

      <button
        type="button"
        onClick={toggleTheme}
        className="btn-icon"
        aria-label={theme === "dark" ? t.theme.light : t.theme.dark}
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

      <select
        value={chainId}
        onChange={(e) => setChainId(e.target.value as typeof chainId)}
        className="nav-select hidden md:inline-flex"
        title="Chain"
        aria-label="Chain"
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
        className="nav-select hidden lg:inline-flex"
        title={t.rbac.role}
        aria-label={t.rbac.role}
      >
        {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>

      <WalletButton />
    </>
  );

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="site-header-glow" aria-hidden />
      <div className="site-header-inner mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <Link href="/" className="site-brand group shrink-0">
          <span className="site-brand-mark flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-300 via-teal-500 to-teal-800 text-xs font-black text-zinc-950 shadow-lg shadow-teal-500/25">
            ED
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-semibold leading-tight text-white transition-colors group-hover:text-teal-200">
              Evidence Desk
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-teal-400/80">
              GenLayer
            </span>
          </span>
        </Link>

        <nav className="site-nav hidden flex-1 items-center justify-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`site-nav-link ${active ? "site-nav-link-active" : ""}`}
              >
                <span className="site-nav-icon" aria-hidden>
                  {NAV_ICONS[l.href]}
                </span>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden flex-wrap items-center justify-end gap-2 md:flex">{toolbar}</div>

        <button
          type="button"
          className="btn-icon ml-auto md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? t.nav.menuClose : t.nav.menuOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {mobileOpen ? (
        <>
          <button
            type="button"
            className="site-mobile-backdrop md:hidden"
            aria-label={t.nav.menuClose}
            onClick={() => setMobileOpen(false)}
          />
          <div id="mobile-nav" className="site-mobile-panel md:hidden">
            <nav className="flex flex-col gap-1 p-3" aria-label="Mobile">
              {links.map((l) => {
                const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`site-mobile-link ${active ? "site-mobile-link-active" : ""}`}
                  >
                    <span aria-hidden>{NAV_ICONS[l.href]}</span>
                    {l.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col gap-2 border-t border-white/8 p-3">{toolbar}</div>
          </div>
        </>
      ) : null}
    </header>
  );
}
