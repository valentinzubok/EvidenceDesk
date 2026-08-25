"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GlassCard, PageHero, StatCard } from "@/components/ui";
import {
  EXPLORER_REGISTRY,
  EXPLORER_SNAPSHOT,
  LIVE_APP_URL,
  REGISTRY_ADDRESS,
  SNAPSHOT_ADDRESS,
} from "@/lib/config";
import { getCaseStats } from "@/lib/contracts";
import type { CaseStats } from "@/lib/types";
import { useLocale } from "./LocaleProvider";

export function HomeContent() {
  const { t } = useLocale();
  const [stats, setStats] = useState<CaseStats | null>(null);

  useEffect(() => {
    getCaseStats()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return (
    <div className="space-y-12">
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6 animate-fade-up">
          <PageHero eyebrow={t.home.tag} title={t.home.title} subtitle={t.home.subtitle} />
          <p className="rounded-xl border border-teal-500/20 bg-teal-500/5 px-4 py-3 text-sm leading-relaxed text-teal-100/80 backdrop-blur-sm">
            {t.home.readOnlyNote}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/cases" className="btn-primary">
              {t.home.openCases}
            </Link>
            <Link href="/criteria" className="btn-ghost">
              {t.home.browseCriteria}
            </Link>
            <a href={LIVE_APP_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              {t.home.liveDemo} ↗
            </a>
          </div>
        </div>
        <div className="animate-fade-up stagger-2 relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-teal-500/10">
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 via-transparent to-violet-500/10" />
          <Image
            src="/cover.png"
            alt="Evidence Desk"
            width={1200}
            height={675}
            className="relative h-auto w-full"
            priority
          />
        </div>
      </section>

      {stats ? (
        <section className="animate-fade-up stagger-3 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            {t.home.statsTitle}
          </h2>
          <div className="flex flex-wrap gap-3">
            <StatCard label="Cases" value={stats.cases} />
            <StatCard label="Clean" value={stats.clean} tone="ok" />
            <StatCard label="Tampered" value={stats.tampered} tone={stats.tampered > 0 ? "bad" : "neutral"} />
          </div>
        </section>
      ) : null}

      <section className="animate-fade-up stagger-3 space-y-4">
        <h2 className="text-lg font-semibold text-white">{t.home.featuresTitle}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {t.home.features.map((f, i) => (
            <GlassCard key={f.title} interactive className={`stagger-${i + 1}`}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-600/5 text-lg">
                {["⛓", "📋", "🔍"][i]}
              </div>
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <GlassCard interactive>
          <h2 className="gradient-text-warm text-lg font-semibold">EvidenceSnapshot</h2>
          <p className="mt-2 font-mono text-[11px] text-zinc-500 break-all">{SNAPSHOT_ADDRESS}</p>
          <p className="mt-3 text-sm text-zinc-400">
            open_case → frozen hash + preview · cross_check → tamper flag
          </p>
          <a
            href={EXPLORER_SNAPSHOT}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-sm text-amber-400 hover:text-amber-300"
          >
            {t.home.explorer} →
          </a>
        </GlassCard>
        <GlassCard interactive>
          <h2 className="gradient-text-warm text-lg font-semibold">PromptRegistry</h2>
          <p className="mt-2 font-mono text-[11px] text-zinc-500 break-all">{REGISTRY_ADDRESS}</p>
          <p className="mt-3 text-sm text-zinc-400">
            Publish, vote, and reuse eq-principle criteria by id
          </p>
          <a
            href={EXPLORER_REGISTRY}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-sm text-amber-400 hover:text-amber-300"
          >
            {t.home.explorer} →
          </a>
        </GlassCard>
      </section>

      <GlassCard>
        <h2 className="mb-4 text-lg font-semibold">{t.home.workflowTitle}</h2>
        <ol className="grid gap-3 sm:grid-cols-2">
          {t.home.workflow.map((step, i) => (
            <li
              key={step}
              className="flex gap-3 rounded-xl border border-white/5 bg-black/20 p-4 text-sm text-zinc-400"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600/20 text-xs font-bold text-teal-300">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </GlassCard>
    </div>
  );
}
