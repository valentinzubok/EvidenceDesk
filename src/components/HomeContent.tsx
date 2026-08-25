"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HeroVisual } from "@/components/HeroVisual";
import { FaqSection } from "@/components/FaqSection";
import { PartnershipSection } from "@/components/PartnershipSection";
import { ProjectStory } from "@/components/ProjectStory";
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

function BulletList({ items, tone }: { items: string[]; tone: "problem" | "solution" }) {
  const dot =
    tone === "problem"
      ? "bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.4)]"
      : "bg-teal-400/80 shadow-[0_0_8px_rgba(45,212,191,0.4)]";
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-zinc-400">
          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function HomeContent() {
  const { t } = useLocale();
  const [stats, setStats] = useState<CaseStats | null>(null);

  useEffect(() => {
    getCaseStats()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* Hero */}
      <section className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
        <div className="order-2 space-y-5 animate-fade-up sm:space-y-6 lg:order-1">
          <PageHero eyebrow={t.home.tag} title={t.home.title} subtitle={t.home.subtitle} />
          <p className="rounded-xl border border-teal-500/20 bg-teal-500/5 px-4 py-3 text-sm leading-relaxed text-teal-100/80 backdrop-blur-sm">
            {t.home.readOnlyNote}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/cases" className="btn-primary w-full justify-center sm:w-auto">
              {t.home.openCases}
            </Link>
            <Link href="/criteria" className="btn-ghost w-full justify-center sm:w-auto">
              {t.home.browseCriteria}
            </Link>
            <a
              href={LIVE_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full justify-center sm:w-auto"
            >
              {t.home.liveDemo} ↗
            </a>
          </div>
        </div>
        <div className="order-1 animate-fade-up stagger-2 lg:order-2">
          <HeroVisual />
        </div>
      </section>

      <ProjectStory />

      {/* What we do */}
      <section className="animate-fade-up space-y-5">
        <div>
          <h2 className="text-xl font-bold text-white sm:text-2xl">{t.home.whatWeDoTitle}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            {t.home.whatWeDoIntro}
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <h3 className="gradient-text-warm text-base font-semibold sm:text-lg">
              {t.home.problemTitle}
            </h3>
            <div className="mt-4">
              <BulletList items={t.home.problemPoints} tone="problem" />
            </div>
          </GlassCard>
          <GlassCard>
            <h3 className="gradient-text text-base font-semibold sm:text-lg">
              {t.home.solutionTitle}
            </h3>
            <div className="mt-4">
              <BulletList items={t.home.solutionPoints} tone="solution" />
            </div>
          </GlassCard>
        </div>
        <GlassCard>
          <h3 className="text-base font-semibold text-white">{t.home.forWhomTitle}</h3>
          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            {t.home.forWhom.map((item, i) => (
              <li
                key={item}
                className="rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-sm text-zinc-400"
              >
                <span className="mr-2 font-mono text-xs text-teal-500/80">0{i + 1}</span>
                {item}
              </li>
            ))}
          </ul>
        </GlassCard>
      </section>

      {stats ? (
        <section className="animate-fade-up space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            {t.home.statsTitle}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard label="Cases" value={stats.cases} />
            <StatCard label="Clean" value={stats.clean} tone="ok" />
            <StatCard
              label="Tampered"
              value={stats.tampered}
              tone={stats.tampered > 0 ? "bad" : "neutral"}
            />
          </div>
        </section>
      ) : null}

      <section className="animate-fade-up space-y-4">
        <h2 className="text-lg font-semibold text-white">{t.home.featuresTitle}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {t.home.features.map((f, i) => (
            <GlassCard key={f.title} interactive>
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

      <PartnershipSection />

      <FaqSection />
    </div>
  );
}
