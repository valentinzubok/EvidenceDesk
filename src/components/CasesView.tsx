"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CaseWizard } from "@/components/CaseWizard";
import {
  Alert,
  EmptyState,
  GlassCard,
  LoadingOverlay,
  PageHero,
  SearchInput,
  Spinner,
  StatCard,
} from "@/components/ui";
import { Tooltip } from "@/components/ui/Tooltip";
import { useLocale } from "@/components/LocaleProvider";
import { useChain } from "@/components/ChainProvider";
import { useErrorToast } from "@/components/ErrorToast";
import { useRole } from "@/components/RoleProvider";
import { useToast } from "@/components/ToastProvider";
import { useWallet } from "@/components/WalletProvider";
import { crossCheckCase, openCase } from "@/lib/contracts";
import { formatWriteError } from "@/lib/errors";
import { mutateCasesCache, useCase, useCaseIds, useCaseStats } from "@/hooks/useGenlayerData";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { canOpenCase, recordOpenCase } from "@/lib/rateLimit";
import {
  getFavoriteCases,
  getRecentCases,
  isFavoriteCase,
  toggleFavoriteCase,
  touchRecentCase,
} from "@/lib/storage";
import { shortHash } from "@/lib/utils";
import type { EvidenceCase } from "@/lib/types";

type CrossCheckPhase = "idle" | "fetching" | "submitting" | "failed";

type Props = {
  initialCaseId?: string;
};

export function CasesView({ initialCaseId }: Props) {
  const router = useRouter();
  const { t, locale } = useLocale();
  const { push } = useToast();
  const pushError = useErrorToast();
  const { canWrite: userCanWrite } = useRole();
  const { adapter, chainId } = useChain();
  const canTransact = userCanWrite && !adapter.readOnly;
  const { address, provider, connect } = useWallet();

  const { data: caseIds = [], isLoading: idsLoading, mutate: refreshIds } = useCaseIds();
  const { data: stats, mutate: refreshStats } = useCaseStats();

  const [selectedId, setSelectedId] = useState<string | null>(initialCaseId ?? null);
  const { data: selected, isLoading: caseLoading, mutate: refreshCase } = useCase(selectedId);

  const [txLoading, setTxLoading] = useState(false);
  const [overlayLabel, setOverlayLabel] = useState("");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"warn" | "ok">("warn");
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [crossCheckId, setCrossCheckId] = useState<string | null>(null);
  const [crossCheckPhase, setCrossCheckPhase] = useState<CrossCheckPhase>("idle");
  const [failedCrossCheckId, setFailedCrossCheckId] = useState<string | null>(null);

  useEffect(() => {
    setRecent(getRecentCases());
    setFavorites(getFavoriteCases());
  }, []);

  useEffect(() => {
    if (initialCaseId) setSelectedId(initialCaseId);
  }, [initialCaseId]);

  const loading = idsLoading || caseLoading;

  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshIds(),
      refreshStats(),
      selectedId ? refreshCase() : Promise.resolve(),
    ]);
    setRecent(getRecentCases());
    mutateCasesCache(chainId);
  }, [refreshIds, refreshStats, refreshCase, selectedId, chainId]);

  function openCaseDetail(id: string) {
    setSelectedId(id);
    touchRecentCase(id);
    setRecent(getRecentCases());
    router.push(`/cases/${encodeURIComponent(id)}`);
  }

  async function resolveWallet() {
    if (address && provider) return { address, provider };
    return connect();
  }

  async function handleWizardSubmit(caseId: string, urlsJson: string) {
    if (!canTransact) {
      setMessage(t.rbac.readOnly);
      setMessageTone("warn");
      throw new Error("read only");
    }
    const session = await resolveWallet();
    if (!session) {
      setMessage(t.cases.connectFirst);
      throw new Error("no wallet");
    }
    const limit = canOpenCase(session.address);
    if (!limit.allowed) {
      setMessage(t.cases.rateLimited.replace("{sec}", String(limit.retryAfterSec)));
      setMessageTone("warn");
      throw new Error("rate limited");
    }

    setTxLoading(true);
    setOverlayLabel(t.cases.openCase);
    setMessage("");
    try {
      const tx = await openCase(session.address, session.provider, caseId, urlsJson);
      recordOpenCase(session.address);
      setMessageTone("ok");
      setMessage(`${t.cases.txSubmitted}: ${shortHash(tx, 8, 6)}`);
      push(t.cases.txSubmitted, "ok");
      touchRecentCase(caseId);
      setRecent(getRecentCases());
      await refreshAll();
      openCaseDetail(caseId);
    } catch (e) {
      setMessageTone("warn");
      setMessage(formatWriteError(e, locale));
      pushError(e, "write");
      throw e;
    } finally {
      setTxLoading(false);
      setOverlayLabel("");
    }
  }

  async function handleCrossCheck(id: string) {
    if (!canTransact) {
      setMessage(t.rbac.readOnly);
      return;
    }
    const session = await resolveWallet();
    if (!session) {
      setMessage(t.cases.connectFirst);
      return;
    }

    setCrossCheckId(id);
    setCrossCheckPhase("fetching");
    setFailedCrossCheckId(null);
    setOverlayLabel(t.cases.crossCheckFetching);
    setMessage("");

    await new Promise((r) => setTimeout(r, 600));
    setCrossCheckPhase("submitting");
    setOverlayLabel(t.cases.crossCheckSubmitting);
    setTxLoading(true);

    try {
      const tx = await crossCheckCase(session.address, session.provider, id);
      setMessageTone("ok");
      setMessage(`${t.cases.txSubmitted}: ${shortHash(tx, 8, 6)}`);
      push(t.cases.txSubmitted, "ok");
      setCrossCheckPhase("idle");
      setSelectedId(id);
      await refreshAll();
    } catch (e) {
      setMessageTone("warn");
      setMessage(formatWriteError(e, locale));
      pushError(e, "write");
      setCrossCheckPhase("failed");
      setFailedCrossCheckId(id);
    } finally {
      setTxLoading(false);
      setOverlayLabel("");
      setCrossCheckId(null);
    }
  }

  function handleFavorite(id: string) {
    toggleFavoriteCase(id);
    setFavorites(getFavoriteCases());
  }

  async function copyCaseJson(data: EvidenceCase) {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    push(t.cases.copiedJson, "ok");
  }

  const filteredIds = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return caseIds;
    return caseIds.filter((id) => id.toLowerCase().includes(q));
  }, [caseIds, search]);

  const { visible, hasMore, loadMore, sentinelRef, reset } = useInfiniteScroll(filteredIds, 15);

  useEffect(() => {
    reset();
  }, [search, reset]);

  const shortcutIds = [...new Set([...favorites, ...recent])].filter(Boolean);

  return (
    <div className="cases-view space-y-8 pb-24">
      <LoadingOverlay show={txLoading} label={overlayLabel || t.common.loading} />

      <CaseWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSubmit={handleWizardSubmit}
        submitting={txLoading}
      />

      <PageHero title={t.cases.title} subtitle={t.cases.subtitle} />

      {adapter.readOnly ? (
        <Alert message={t.cases.readOnlyChain.replace("{chain}", adapter.label)} tone="warn" />
      ) : null}

      {stats ? (
        <div className="flex flex-wrap gap-3 animate-fade-up">
          <StatCard label="Cases" value={stats.cases} />
          <StatCard label="Clean" value={stats.clean} tone="ok" />
          <StatCard
            label="Tampered"
            value={stats.tampered}
            tone={stats.tampered > 0 ? "bad" : "neutral"}
          />
        </div>
      ) : null}

      {crossCheckPhase === "fetching" || crossCheckPhase === "submitting" ? (
        <GlassCard className="border-teal-500/30 bg-teal-500/5">
          <Spinner
            label={
              crossCheckPhase === "fetching"
                ? t.cases.crossCheckFetching
                : t.cases.crossCheckSubmitting
            }
          />
          {crossCheckId ? (
            <p className="mt-2 font-mono text-xs text-teal-300/80">{crossCheckId}</p>
          ) : null}
        </GlassCard>
      ) : null}

      {failedCrossCheckId ? (
        <GlassCard className="border-amber-500/30 bg-amber-500/5">
          <p className="text-sm text-amber-200">
            {t.cases.crossCheckFailed}: {failedCrossCheckId}
          </p>
          <Tooltip label={t.tooltips.crossCheck}>
            <button
              type="button"
              onClick={() => handleCrossCheck(failedCrossCheckId)}
              className="btn-primary mt-3 !py-2 !text-sm"
            >
              {t.common.retry}
            </button>
          </Tooltip>
        </GlassCard>
      ) : null}

      {shortcutIds.length > 0 ? (
        <GlassCard className="animate-fade-up">
          <h2 className="mb-3 text-sm font-semibold text-zinc-300">
            {t.cases.favorites} · {t.cases.recent}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {shortcutIds.map((id) => (
              <li key={id}>
                <Link
                  href={`/cases/${encodeURIComponent(id)}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-teal-300 transition hover:border-teal-500/40 hover:bg-teal-500/10"
                >
                  {isFavoriteCase(id) ? "★ " : ""}
                  {id}
                </Link>
              </li>
            ))}
          </ul>
        </GlassCard>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="animate-fade-up flex flex-col items-start gap-4">
          <h2 className="text-lg font-semibold text-white">{t.cases.openNew}</h2>
          <p className="text-sm text-zinc-400">{t.wizard.reviewHint}</p>
          <button
            type="button"
            onClick={() => setWizardOpen(true)}
            disabled={!canTransact}
            className="btn-primary w-full sm:w-auto"
          >
            {t.wizard.openWizard}
          </button>
          {!canTransact ? (
            <p className="text-xs text-zinc-500">
              {adapter.readOnly
                ? t.cases.readOnlyChain.replace("{chain}", adapter.label)
                : t.rbac.readOnly}
            </p>
          ) : null}
        </GlassCard>

        <GlassCard className="animate-fade-up stagger-2 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">{t.cases.onChain}</h2>
            <button type="button" onClick={() => void refreshAll()} className="btn-icon">
              ↻ {t.cases.refresh}
            </button>
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder={t.cases.search} />
          {idsLoading && caseIds.length === 0 ? (
            <Spinner label={t.cases.loading} />
          ) : filteredIds.length === 0 ? (
            <EmptyState message={search ? t.common.error : t.cases.noCases} />
          ) : (
            <>
              <p className="text-xs text-zinc-500">
                {t.cases.showingCount
                  .replace("{n}", String(visible.length))
                  .replace("{total}", String(filteredIds.length))}
              </p>
              <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                {visible.map((id) => (
                  <li
                    key={id}
                    className={`flex flex-wrap items-center gap-2 rounded-xl border p-3 transition ${
                      selected?.case_id === id
                        ? "border-teal-500/40 bg-teal-500/5"
                        : "border-white/5 surface-deep hover:border-white/15"
                    }`}
                  >
                    <Link
                      href={`/cases/${encodeURIComponent(id)}`}
                      className="font-mono text-sm text-teal-300 hover:underline"
                    >
                      {id}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleFavorite(id)}
                      className="btn-icon"
                      title={isFavoriteCase(id) ? t.cases.removeFavorite : t.cases.addFavorite}
                    >
                      {isFavoriteCase(id) ? "★" : "☆"}
                    </button>
                    <Tooltip label={t.tooltips.crossCheck}>
                      <button
                        type="button"
                        onClick={() => handleCrossCheck(id)}
                        disabled={loading || txLoading || !canTransact}
                        className="btn-icon ml-auto"
                      >
                        {t.cases.crossCheck}
                      </button>
                    </Tooltip>
                  </li>
                ))}
                {hasMore ? (
                  <li ref={sentinelRef} className="py-2 text-center">
                    <button type="button" onClick={loadMore} className="btn-ghost !py-1.5 !text-xs">
                      {t.cases.loadMore}
                    </button>
                  </li>
                ) : null}
              </ul>
            </>
          )}
        </GlassCard>
      </div>

      {selected?.case_id ? (
        <GlassCard className="animate-fade-up space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
              {t.cases.detail}: <span className="font-mono text-teal-300">{selected.case_id}</span>
            </h2>
            <button type="button" onClick={() => copyCaseJson(selected)} className="btn-icon">
              {t.cases.copyJson}
            </button>
          </div>
          <p className="text-sm">
            {t.cases.tampered}:{" "}
            {selected.tampered ? (
              <span className="badge-bad">{t.cases.yes}</span>
            ) : (
              <span className="badge-ok">{t.cases.no}</span>
            )}
          </p>
          {selected.items?.length ? (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-zinc-400">{t.cases.items}</h3>
              {selected.items.map((item, idx) => (
                <div
                  key={`${item.url}-${idx}`}
                  className="surface-deep rounded-xl border border-white/5 p-4 text-sm space-y-2"
                >
                  <p className="text-xs text-zinc-500">{t.cases.url}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-teal-400 hover:underline"
                  >
                    {item.url}
                  </a>
                  <p className="text-xs text-zinc-500">{t.cases.hash}</p>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard.writeText(item.content_hash);
                      push(t.cases.copiedHash, "ok");
                    }}
                    className="font-mono text-[11px] text-zinc-400 hover:text-teal-300"
                    title={item.content_hash}
                  >
                    {shortHash(item.content_hash, 8, 6)}
                  </button>
                  {item.preview ? (
                    <>
                      <p className="text-xs text-zinc-500">{t.cases.preview}</p>
                      <p className="text-zinc-300 line-clamp-3">{item.preview}</p>
                    </>
                  ) : null}
                  <span className="badge-neutral inline-block">{item.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <pre className="surface-code overflow-x-auto rounded-xl p-4 text-xs">
              {JSON.stringify(selected, null, 2)}
            </pre>
          )}
        </GlassCard>
      ) : null}

      <Alert message={message} tone={messageTone} />

      <div className="cases-sticky-cta" role="region" aria-label={t.cases.openNew}>
        <div className="cases-sticky-inner mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 sm:px-0">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">{t.cases.openNew}</p>
            <p className="text-xs text-zinc-400 truncate">
              {adapter.readOnly
                ? t.cases.readOnlyChain.replace("{chain}", adapter.label)
                : address
                  ? t.nav.connected
                  : t.cases.connectFirst}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {canTransact ? (
              <button
                type="button"
                onClick={() => setWizardOpen(true)}
                className="btn-primary !py-2"
              >
                {t.wizard.openWizard}
              </button>
            ) : null}
            {!address && !adapter.readOnly ? (
              <button type="button" onClick={() => void connect()} className="btn-ghost !py-2">
                {t.nav.connect}
              </button>
            ) : null}
            <Link href="/criteria" className="btn-ghost !py-2">
              {t.nav.criteria}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
