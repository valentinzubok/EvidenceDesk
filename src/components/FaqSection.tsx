"use client";

import { useState } from "react";
import { GlassCard } from "./ui";
import { useLocale } from "./LocaleProvider";

export function FaqSection() {
  const { t } = useLocale();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="animate-fade-up space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white sm:text-2xl">{t.faq.title}</h2>
        <p className="mt-1 text-sm text-zinc-400">{t.faq.subtitle}</p>
      </div>
      <GlassCard className="divide-y divide-white/5 !p-0 overflow-hidden">
        {t.faq.items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/5"
              >
                <span className="text-sm font-medium text-zinc-200">{item.q}</span>
                <span className="text-teal-400 transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "" }}>
                  ▾
                </span>
              </button>
              {isOpen ? (
                <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-400">{item.a}</p>
              ) : null}
            </div>
          );
        })}
      </GlassCard>
    </section>
  );
}
