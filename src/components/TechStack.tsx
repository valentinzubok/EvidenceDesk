"use client";

import { ECOSYSTEM_STACK, stackToneClass } from "@/lib/stack";
import { useLocale } from "./LocaleProvider";

export function TechStack() {
  const { t } = useLocale();

  return (
    <section className="animate-fade-up space-y-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
          {t.home.stackTitle}
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-zinc-400">{t.home.stackSubtitle}</p>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {ECOSYSTEM_STACK.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex h-full flex-col rounded-xl border px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${stackToneClass(item.tone)}`}
            >
              <span className="text-sm font-semibold">{item.name}</span>
              <span className="mt-1 text-[11px] opacity-75">{item.role}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
