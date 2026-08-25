"use client";

import Link from "next/link";
import { GlassCard, PageHero } from "@/components/ui";
import { useLocale } from "@/components/LocaleProvider";

const PACKS = [
  { id: "kyc-basic", title: "KYC baseline", tags: ["kyc", "identity"], price: "Free" },
  { id: "aml-screen", title: "AML screening", tags: ["aml", "compliance"], price: "Free" },
  { id: "legal-tos", title: "Terms of Service drift", tags: ["legal", "url"], price: "Free" },
  { id: "news-date", title: "Publication date window", tags: ["news", "timestamp"], price: "Free" },
] as const;

export default function MarketplacePage() {
  const { t } = useLocale();

  return (
    <div className="space-y-8">
      <PageHero title={t.marketplace.title} subtitle={t.marketplace.subtitle} />
      <p className="text-sm text-zinc-400">{t.marketplace.note}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {PACKS.map((pack) => (
          <GlassCard key={pack.id} interactive className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-white">{pack.title}</h2>
              <span className="badge-neutral">{pack.price}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {pack.tags.map((tag) => (
                <span key={tag} className="badge-neutral text-[10px]">
                  {tag}
                </span>
              ))}
            </div>
            <Link href={`/criteria?tag=${pack.tags[0]}`} className="btn-primary inline-flex">
              {t.marketplace.add}
            </Link>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
