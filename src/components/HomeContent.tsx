"use client";

import Image from "next/image";
import Link from "next/link";
import {
  EXPLORER_REGISTRY,
  EXPLORER_SNAPSHOT,
  LIVE_APP_URL,
  REGISTRY_ADDRESS,
  SNAPSHOT_ADDRESS,
} from "@/lib/config";
import { useLocale } from "./LocaleProvider";

export function HomeContent() {
  const { t } = useLocale();

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-teal-400">{t.home.tag}</p>
          <h1 className="text-4xl font-bold tracking-tight">{t.home.title}</h1>
          <p className="text-zinc-400">{t.home.subtitle}</p>
          <p className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-400">
            {t.home.readOnlyNote}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/cases"
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500"
            >
              {t.home.openCases}
            </Link>
            <Link
              href="/criteria"
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500"
            >
              {t.home.browseCriteria}
            </Link>
            <a
              href={LIVE_APP_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500"
            >
              Live demo ↗
            </a>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <Image
            src="/cover.png"
            alt="Evidence Desk"
            width={1200}
            height={675}
            className="h-auto w-full"
            priority
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-2">
          <h2 className="font-semibold text-teal-400">EvidenceSnapshot</h2>
          <p className="font-mono text-xs text-zinc-500 break-all">{SNAPSHOT_ADDRESS}</p>
          <p className="text-sm text-zinc-400">
            open_case → frozen hash + preview. cross_check → tamper flag.
          </p>
          <a
            href={EXPLORER_SNAPSHOT}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-amber-400 hover:underline"
          >
            View on Explorer →
          </a>
        </div>
        <div className="card space-y-2">
          <h2 className="font-semibold text-teal-400">PromptRegistry</h2>
          <p className="font-mono text-xs text-zinc-500 break-all">{REGISTRY_ADDRESS}</p>
          <p className="text-sm text-zinc-400">
            Publish, vote, and reuse eq-principle criteria by id.
          </p>
          <a
            href={EXPLORER_REGISTRY}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-amber-400 hover:underline"
          >
            View on Explorer →
          </a>
        </div>
      </section>

      <section className="card">
        <h2 className="mb-3 font-semibold">{t.home.workflowTitle}</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-400">
          {t.home.workflow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
