"use client";

import Script from "next/script";
import { ANALYTICS_URL } from "@/lib/config";

export function Analytics() {
  if (!ANALYTICS_URL) return null;

  const isPlausible = ANALYTICS_URL.includes("plausible");
  const src = isPlausible ? `${ANALYTICS_URL}/js/script.js` : ANALYTICS_URL;

  return (
    <Script
      defer
      data-domain={isPlausible ? "evidence-desk" : undefined}
      src={src}
      strategy="afterInteractive"
    />
  );
}

/** Fire custom analytics event (Plausible / umami compatible). */
export function trackEvent(name: string, props?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    plausible?: (n: string, o?: { props?: Record<string, string | number> }) => void;
    umami?: { track: (n: string, d?: Record<string, string | number>) => void };
  };
  w.plausible?.(name, props ? { props } : undefined);
  w.umami?.track(name, props);
}
