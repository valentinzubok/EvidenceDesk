"use client";

import Link from "next/link";
import {
  EXPLORER_REGISTRY,
  EXPLORER_SNAPSHOT,
  LIVE_APP_URL,
  REGISTRY_ADDRESS,
  SNAPSHOT_ADDRESS,
} from "@/lib/config";
import { PARTNERS } from "@/lib/stack";
import { shortHash } from "@/lib/utils";
import { useLocale } from "./LocaleProvider";

const GITHUB_REPO = "https://github.com/valentinzubok/EvidenceDesk";

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer mt-auto border-t border-white/5">
      <div className="site-footer-glow" aria-hidden />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" className="site-brand group inline-flex items-center gap-2.5">
              <span className="site-brand-mark flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-300 via-teal-500 to-teal-800 text-xs font-black text-zinc-950 shadow-lg shadow-teal-500/20">
                ED
              </span>
              <span>
                <span className="block text-sm font-semibold text-white group-hover:text-teal-200 transition-colors">
                  Evidence Desk
                </span>
                <span className="block text-[10px] uppercase tracking-[0.18em] text-teal-400/75">
                  GenLayer Project
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              {t.footer.tagline}
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-teal-500/25 bg-teal-500/10 px-3 py-1 text-[11px] font-medium text-teal-200/90">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
              Studionet · genlayer-js
            </p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="footer-heading">{t.footer.product}</h3>
            <ul className="footer-links">
              <li>
                <Link href="/cases">{t.nav.cases}</Link>
              </li>
              <li>
                <Link href="/criteria">{t.nav.criteria}</Link>
              </li>
              <li>
                <Link href="/marketplace">{t.nav.marketplace}</Link>
              </li>
              <li>
                <a href={LIVE_APP_URL} target="_blank" rel="noopener noreferrer">
                  {t.footer.liveDemo}
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="footer-heading">{t.footer.resources}</h3>
            <ul className="footer-links">
              <li>
                <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://docs.genlayer.com/" target="_blank" rel="noopener noreferrer">
                  GenLayer Docs
                </a>
              </li>
              <li>
                <a
                  href="https://studio.genlayer.com/contracts"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GenLayer Studio
                </a>
              </li>
              <li>
                <a
                  href="https://portal.genlayer.foundation/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Builder Portal
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="footer-heading">{t.footer.contracts}</h3>
            <ul className="footer-links space-y-2.5">
              <li>
                <a
                  href={EXPLORER_SNAPSHOT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-mono"
                >
                  EvidenceSnapshot
                  <span className="block text-[11px] text-zinc-500">
                    {shortHash(SNAPSHOT_ADDRESS, 6, 4)}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={EXPLORER_REGISTRY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-mono"
                >
                  PromptRegistry
                  <span className="block text-[11px] text-zinc-500">
                    {shortHash(REGISTRY_ADDRESS, 6, 4)}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-chip"
            >
              {p.name}
            </a>
          ))}
        </div>

        <div className="site-footer-bottom mt-8 flex flex-col gap-3 border-t border-white/8 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Evidence Desk · {t.footer.mit}
          </p>
          <p className="max-w-xl text-[11px] leading-relaxed">{t.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
