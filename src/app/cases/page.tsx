"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import { useWallet } from "@/components/WalletProvider";
import { crossCheckCase, getCase, getCaseStats, listCaseIds, openCase } from "@/lib/contracts";
import { DEMO_URL } from "@/lib/config";
import { formatReadError, formatWriteError } from "@/lib/errors";
import { tValidation } from "@/lib/i18n/messages";
import {
  getFavoriteCases,
  getRecentCases,
  isFavoriteCase,
  toggleFavoriteCase,
  touchRecentCase,
} from "@/lib/storage";
import type { CaseStats, EvidenceCase } from "@/lib/types";
import { isValidCaseId, parseUrlsJson, sanitizeCaseId } from "@/lib/validate";

function generateCaseId(): string {
  return `case-${Date.now().toString(36)}`;
}

export default function CasesPage() {
  const { t, locale } = useLocale();
  const { push } = useToast();
  const { address, provider, connect } = useWallet();
  const [caseIds, setCaseIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<EvidenceCase | null>(null);
  const [caseId, setCaseId] = useState("demo-desk-1");
  const [urlsJson, setUrlsJson] = useState(JSON.stringify([DEMO_URL], null, 2));
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"warn" | "ok">("warn");
  const [stats, setStats] = useState<CaseStats | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setRecent(getRecentCases());
    setFavorites(getFavoriteCases());
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const ids = await listCaseIds();
      setCaseIds(ids);
      setStats(await getCaseStats());
      setRecent(getRecentCases());
    } catch (e) {
      setMessage(formatReadError(e, locale));
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    load();
  }, [load]);

  async function loadCase(id: string) {
    setLoading(true);
    setMessage("");
    try {
      const data = await getCase(id);
      setSelected(data);
      touchRecentCase(id);
      setRecent(getRecentCases());
    } catch (e) {
      setMessage(formatReadError(e, locale));
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenCase() {
    const id = sanitizeCaseId(caseId);
    if (!isValidCaseId(id)) {
      setMessage(t.cases.invalidCaseId);
      setMessageTone("warn");
      return;
    }
    const parsed = parseUrlsJson(urlsJson);
    if (!parsed.ok) {
      setMessage(`${t.cases.invalidUrls}: ${tValidation(locale, parsed.error)}`);
      setMessageTone("warn");
      return;
    }
    let walletAddress = address;
    let walletProvider = provider;
    if (!walletAddress || !walletProvider) {
      const session = await connect();
      if (!session) {
        setMessage(t.cases.connectFirst);
        return;
      }
      walletAddress = session.address;
      walletProvider = session.provider;
    }

    setTxLoading(true);
    setMessage("");
    try {
      const tx = await openCase(walletAddress, walletProvider, id, JSON.stringify(parsed.urls));
      setMessageTone("ok");
      setMessage(`${t.cases.txSubmitted}: ${tx}`);
      push(`${t.cases.txSubmitted}`, "ok");
      touchRecentCase(id);
      setRecent(getRecentCases());
      await load();
    } catch (e) {
      setMessageTone("warn");
      setMessage(formatWriteError(e, locale));
    } finally {
      setTxLoading(false);
    }
  }

  async function handleCrossCheck(id: string) {
    let walletAddress = address;
    let walletProvider = provider;
    if (!walletAddress || !walletProvider) {
      const session = await connect();
      if (!session) {
        setMessage(t.cases.connectFirst);
        return;
      }
      walletAddress = session.address;
      walletProvider = session.provider;
    }

    setTxLoading(true);
    setMessage("");
    try {
      const tx = await crossCheckCase(walletAddress, walletProvider, id);
      setMessageTone("ok");
      setMessage(`${t.cases.txSubmitted}: ${tx}`);
      push(t.cases.txSubmitted, "ok");
      await loadCase(id);
      await load();
    } catch (e) {
      setMessageTone("warn");
      setMessage(formatWriteError(e, locale));
    } finally {
      setTxLoading(false);
    }
  }

  function handleFavorite(id: string) {
    toggleFavoriteCase(id);
    setFavorites(getFavoriteCases());
  }

  async function copyCaseJson() {
    if (!selected) return;
    await navigator.clipboard.writeText(JSON.stringify(selected, null, 2));
    push(t.cases.copiedJson, "ok");
  }

  const filteredIds = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return caseIds;
    return caseIds.filter((id) => id.toLowerCase().includes(q));
  }, [caseIds, search]);

  const shortcutIds = [...new Set([...favorites, ...recent])].filter(Boolean);

  return (
    <div className="space-y-8">
      <LoadingOverlay show={txLoading} label={t.common.loading} />

      <PageHero title={t.cases.title} subtitle={t.cases.subtitle} />

      {stats ? (
        <div className="flex flex-wrap gap-3 animate-fade-up">
          <StatCard label="Cases" value={stats.cases} />
          <StatCard label="Clean" value={stats.clean} tone="ok" />
          <StatCard label="Tampered" value={stats.tampered} tone={stats.tampered > 0 ? "bad" : "neutral"} />
        </div>
      ) : null}

      {shortcutIds.length > 0 ? (
        <GlassCard className="animate-fade-up">
          <h2 className="mb-3 text-sm font-semibold text-zinc-300">
            {t.cases.favorites} · {t.cases.recent}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {shortcutIds.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => loadCase(id)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-teal-300 transition hover:border-teal-500/40 hover:bg-teal-500/10"
                >
                  {isFavoriteCase(id) ? "★ " : ""}
                  {id}
                </button>
              </li>
            ))}
          </ul>
        </GlassCard>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="animate-fade-up space-y-4">
          <h2 className="text-lg font-semibold text-white">{t.cases.openNew}</h2>
          <label className="block space-y-1.5 text-sm text-zinc-400">
            {t.cases.caseId}
            <div className="flex gap-2">
              <input
                value={caseId}
                onChange={(e) => setCaseId(sanitizeCaseId(e.target.value))}
                maxLength={64}
              />
              <button
                type="button"
                onClick={() => setCaseId(generateCaseId())}
                className="btn-icon shrink-0 whitespace-nowrap"
              >
                {t.cases.generateId}
              </button>
            </div>
          </label>
          <label className="block space-y-1.5 text-sm text-zinc-400">
            {t.cases.urlsJson}
            <textarea
              value={urlsJson}
              onChange={(e) => setUrlsJson(e.target.value)}
              rows={4}
              className="font-mono text-xs"
              spellCheck={false}
            />
          </label>
          <button
            type="button"
            onClick={() => setUrlsJson(JSON.stringify([DEMO_URL], null, 2))}
            className="btn-icon text-xs"
          >
            {t.cases.addUrl}
          </button>
          <button
            type="button"
            onClick={handleOpenCase}
            disabled={loading || txLoading}
            className="btn-primary w-full sm:w-auto"
          >
            {t.cases.openCase}
          </button>
        </GlassCard>

        <GlassCard className="animate-fade-up stagger-2 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">{t.cases.onChain}</h2>
            <button type="button" onClick={load} className="btn-icon">
              ↻ {t.cases.refresh}
            </button>
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder={t.cases.search} />
          {loading && caseIds.length === 0 ? (
            <Spinner label={t.cases.loading} />
          ) : filteredIds.length === 0 ? (
            <EmptyState message={search ? t.common.error : t.cases.noCases} />
          ) : (
            <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {filteredIds.map((id) => (
                <li
                  key={id}
                  className={`flex flex-wrap items-center gap-2 rounded-xl border p-3 transition ${
                    selected?.case_id === id
                      ? "border-teal-500/40 bg-teal-500/5"
                      : "border-white/5 bg-black/20 hover:border-white/15"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => loadCase(id)}
                    className="font-mono text-sm text-teal-300 hover:underline"
                  >
                    {id}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFavorite(id)}
                    className="btn-icon"
                    title={isFavoriteCase(id) ? t.cases.removeFavorite : t.cases.addFavorite}
                  >
                    {isFavoriteCase(id) ? "★" : "☆"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCrossCheck(id)}
                    disabled={loading || txLoading}
                    className="btn-icon ml-auto"
                  >
                    {t.cases.crossCheck}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>

      {selected?.case_id ? (
        <GlassCard className="animate-fade-up space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
              {t.cases.detail}: <span className="font-mono text-teal-300">{selected.case_id}</span>
            </h2>
            <button type="button" onClick={copyCaseJson} className="btn-icon">
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
                  className="rounded-xl border border-white/5 bg-black/30 p-4 text-sm space-y-2"
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
                  <p className="font-mono text-[11px] text-zinc-400 break-all">{item.content_hash}</p>
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
            <pre className="overflow-x-auto rounded-xl bg-black/40 p-4 text-xs text-zinc-400">
              {JSON.stringify(selected, null, 2)}
            </pre>
          )}
        </GlassCard>
      ) : null}

      <Alert message={message} tone={messageTone} />
    </div>
  );
}
