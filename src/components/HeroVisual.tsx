"use client";

import { useMemo } from "react";

/** Stylized fingerprint ridges — procedural paths, no external assets. */
function FingerprintSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 260"
      className={className}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="fp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.5" />
        </linearGradient>
        <filter id="fp-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#fp-glow)" stroke="url(#fp-grad)" strokeWidth="1.2" strokeLinecap="round">
        <path className="fp-ridge fp-ridge-1" d="M100 20 C60 20 35 55 35 95 C35 130 55 155 100 155 C145 155 165 130 165 95 C165 55 140 20 100 20" />
        <path className="fp-ridge fp-ridge-2" d="M100 45 C72 45 55 68 55 98 C55 122 72 138 100 138 C128 138 145 122 145 98 C145 68 128 45 100 45" />
        <path className="fp-ridge fp-ridge-3" d="M100 68 C82 68 72 82 72 100 C72 115 82 125 100 125 C118 125 128 115 128 100 C128 82 118 68 100 68" />
        <path className="fp-ridge fp-ridge-4" d="M100 88 C92 88 88 94 88 102 C88 108 92 112 100 112 C108 112 112 108 112 102 C112 94 108 88 100 88" />
        <path className="fp-ridge fp-ridge-5" d="M45 110 C30 140 28 175 40 210" />
        <path className="fp-ridge fp-ridge-6" d="M155 110 C170 140 172 175 160 210" />
        <path className="fp-ridge fp-ridge-7" d="M65 165 C58 190 62 220 78 240" />
        <path className="fp-ridge fp-ridge-8" d="M135 165 C142 190 138 220 122 240" />
        <path className="fp-ridge fp-ridge-9" d="M100 155 L100 250" opacity="0.4" />
      </g>
      <circle cx="100" cy="100" r="4" fill="#99f6e4" className="fp-core" />
    </svg>
  );
}

function HashRing() {
  const chars = useMemo(
    () => "0x7a3f…e9c2 · sha256 · frozen · on-chain · evidence ·".split(""),
    [],
  );
  return (
    <div className="hero-hash-ring" aria-hidden>
      <svg viewBox="0 0 320 320" className="h-full w-full">
        <defs>
          <path
            id="hero-orbit"
            d="M 160,160 m -120,0 a 120,120 0 1,1 240,0 a 120,120 0 1,1 -240,0"
          />
        </defs>
        <text className="hero-orbit-text fill-teal-400/60 text-[11px] font-mono">
          <textPath href="#hero-orbit" startOffset="0%">
            {chars.join("")}
            {chars.join("")}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

export function HeroVisual() {
  return (
    <div
      className="hero-visual relative mx-auto aspect-[4/3] w-full max-w-lg sm:max-w-xl lg:max-w-none lg:aspect-square"
      role="img"
      aria-label="Animated evidence fingerprint visualization"
    >
      <div className="hero-visual-frame absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/90 via-zinc-950/95 to-black/90 shadow-2xl shadow-teal-500/10">
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div className="hero-scan-beam absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-teal-400/25 via-teal-400/5 to-transparent" />

        <HashRing />

        <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-12">
          <FingerprintSvg className="hero-fingerprint h-[55%] w-auto max-h-[220px] sm:max-h-[280px]" />
        </div>

        <div className="hero-pulse-ring absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-500/20 sm:h-40 sm:w-40" />
        <div className="hero-pulse-ring hero-pulse-ring-2 absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-500/10 sm:h-56 sm:w-56" />

        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 sm:bottom-4 sm:left-4 sm:right-4">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300 sm:text-xs">
            SHA-256
          </span>
          <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-1 text-[10px] font-medium text-teal-300 sm:text-xs">
            Studionet
          </span>
          <span className="hidden rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[10px] font-medium text-violet-300 sm:inline sm:text-xs">
            cross_check
          </span>
        </div>
      </div>
    </div>
  );
}
