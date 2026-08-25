"use client";

import { PARTNERS } from "@/lib/stack";
import { useLocale } from "./LocaleProvider";

export function PartnershipSection() {
  const { t } = useLocale();

  return (
    <section className="animate-fade-up mt-4 border-t border-white/5 pt-10 sm:pt-12">
      <div className="theme-panel relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl"
          aria-hidden
        />

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-400/90">
          {t.home.partnershipEyebrow}
        </p>
        <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">{t.home.partnershipTitle}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          {t.home.partnershipBody}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {PARTNERS.map((partner) => (
            <a
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group surface-deep rounded-xl border border-white/8 p-4 transition hover:border-teal-500/30 hover:bg-teal-500/5"
            >
              <p className="font-semibold text-white group-hover:text-teal-200">{partner.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500 sm:text-sm">
                {t.home.partnerDesc[partner.descKey]}
              </p>
            </a>
          ))}
        </div>

        <p className="callout-teal mt-6 rounded-xl border border-teal-500/15 bg-teal-500/5 px-4 py-3 text-sm leading-relaxed">
          {t.home.partnershipPurpose}
        </p>
      </div>
    </section>
  );
}
