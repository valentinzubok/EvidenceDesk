"use client";

import { useLocale } from "./LocaleProvider";

const STEP_ICONS = ["🌐", "🔒", "📋", "⚖️"];

export function ProjectStory() {
  const { t } = useLocale();
  const steps = t.home.storySteps;

  return (
    <section className="animate-fade-up relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/60 via-zinc-950/80 to-teal-950/30 p-6 sm:p-8">
      <div className="story-aurora pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-10 space-y-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-400/90">
            {t.home.storyEyebrow}
          </p>
          <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">{t.home.storyTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            {t.home.storySubtitle}
          </p>
        </div>

        {/* Animated pipeline */}
        <div className="story-pipeline relative">
          <svg
            className="story-pipeline-svg pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
            viewBox="0 0 800 120"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              className="story-flow-path"
              d="M 80 60 H 720"
              fill="none"
              stroke="url(#flow-grad)"
              strokeWidth="2"
              strokeDasharray="8 12"
            />
            <defs>
              <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>

          <ol className="story-steps grid gap-4 sm:grid-cols-4 sm:gap-3">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="story-step group relative flex flex-col items-center text-center"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="story-step-node relative flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-500/30 bg-teal-500/10 text-2xl shadow-lg shadow-teal-500/10 transition group-hover:border-teal-400/50 group-hover:shadow-teal-500/25 sm:h-[4.5rem] sm:w-[4.5rem]">
                  <span className="story-step-glow absolute inset-0 rounded-2xl" aria-hidden />
                  <span className="relative">{STEP_ICONS[i]}</span>
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                {i < steps.length - 1 ? (
                  <span
                    className="story-mobile-connector my-2 block h-6 w-px bg-gradient-to-b from-teal-500/50 to-transparent sm:hidden"
                    aria-hidden
                  />
                ) : null}
                <h3 className="mt-3 text-sm font-semibold text-white">{step.title}</h3>
                <p className="mt-1 max-w-[180px] text-xs leading-relaxed text-zinc-500">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>

          <div
            className="story-particles pointer-events-none absolute inset-0 hidden sm:block"
            aria-hidden
          >
            {[0, 1, 2].map((n) => (
              <span key={n} className={`story-particle story-particle-${n + 1}`} />
            ))}
          </div>
        </div>

        <blockquote className="relative border-l-2 border-teal-500/50 pl-4 text-sm italic leading-relaxed text-zinc-300 sm:text-base">
          {t.home.storyQuote}
        </blockquote>
      </div>
    </section>
  );
}
