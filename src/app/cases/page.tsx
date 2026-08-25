"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, LoadingOverlay, Spinner } from "@/components/ui";
import { useLocale } from "@/components/LocaleProvider";
import { useWallet } from "@/components/WalletProvider";
import { crossCheckCase, getCase, getCaseStats, listCaseIds, openCase } from "@/lib/contracts";
import { DEMO_URL } from "@/lib/config";
import { formatReadError, formatWriteError } from "@/lib/errors";
import {
  getFavoriteCases,
  getRecentCases,
  isFavoriteCase,
  toggleFavoriteCase,
  touchRecentCase,
} from "@/lib/storage";
import type { CaseStats, EvidenceCase } from "@/lib/types";

export default function CasesPage() {
  const { t, locale } = useLocale();
  const { address, provider } = useWallet();
  const [caseIds, setCaseIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<EvidenceCase | null>(null);
  const [caseId, setCaseId] = useState("demo-desk-1");
  const [urlsJson, setUrlsJson] = useState(JSON.stringify([DEMO_URL]));
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"warn" | "ok">("warn");
  const [stats, setStats] = useState<CaseStats | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

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
      if (ids.length > 0) {
        const last = await getCase(ids[ids.length - 1]);
        setSelected(last);
        if (last?.case_id) touchRecentCase(last.case_id);
      } else {
        setSelected(null);
      }
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
    if (!address || !provider) {
      setMessage(t.cases.connectFirst);
      return;
    }
    setTxLoading(true);
    setMessage("");
    try {
      const tx = await openCase(address, provider, caseId, urlsJson);
      setMessageTone("ok");
      setMessage(`open_case submitted: ${tx}`);
      touchRecentCase(caseId);
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
    if (!address || !provider) {
      setMessage(t.cases.connectFirst);
      return;
    }
    setTxLoading(true);
    setMessage("");
    try {
      const tx = await crossCheckCase(address, provider, id);
      setMessageTone("ok");
      setMessage(`cross_check submitted: ${tx}`);
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

  const shortcutIds = [...new Set([...favorites, ...recent])].filter(Boolean);

  return (
    <div className="space-y-6">
      <LoadingOverlay show={txLoading} label={t.common.loading} />

      <div>
        <h1 className="text-2xl font-bold">{t.cases.title}</h1>
        <p className="text-sm text-zinc-400">{t.cases.subtitle}</p>
      </div>

      {stats && (
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="badge-ok">Cases: {stats.cases}</span>
          <span className="badge-ok">Clean: {stats.clean}</span>
          {stats.tampered > 0 && <span className="badge-bad">Tampered: {stats.tampered}</span>}
        </div>
      )}

      {shortcutIds.length > 0 && (
        <div className="card space-y-3">
          <h2 className="font-semibold">
            {t.cases.favorites} / {t.cases.recent}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {shortcutIds.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => loadCase(id)}
                  className="rounded-full border border-zinc-700 px-3 py-1 font-mono text-xs hover:border-teal-600"
                >
                  {isFavoriteCase(id) ? "★ " : ""}
                  {id}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card space-y-3">
        <h2 className="font-semibold">{t.cases.openNew}</h2>
        <label className="block text-sm text-zinc-400">
          {t.cases.caseId}
          <input value={caseId} onChange={(e) => setCaseId(e.target.value)} className="mt-1" />
        </label>
        <label className="block text-sm text-zinc-400">
          {t.cases.urlsJson}
          <textarea
            value={urlsJson}
            onChange={(e) => setUrlsJson(e.target.value)}
            rows={2}
            className="mt-1 font-mono text-xs"
          />
        </label>
        <button
          type="button"
          onClick={handleOpenCase}
          disabled={loading || txLoading}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500"
        >
          {t.cases.openCase}
        </button>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{t.cases.onChain}</h2>
          <button type="button" onClick={load} className="text-sm text-teal-400 hover:underline">
            {t.cases.refresh}
          </button>
        </div>
        {loading && caseIds.length === 0 ? (
          <Spinner label={t.cases.loading} />
        ) : caseIds.length === 0 ? (
          <p className="text-sm text-zinc-500">{t.cases.noCases}</p>
        ) : (
          <ul className="space-y-2">
            {caseIds.map((id) => (
              <li key={id} className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-800 p-3">
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
                  className="rounded border border-zinc-700 px-2 py-1 text-xs hover:border-zinc-500"
                  title={isFavoriteCase(id) ? t.cases.removeFavorite : t.cases.addFavorite}
                >
                  {isFavoriteCase(id) ? "★" : "☆"}
                </button>
                <button
                  type="button"
                  onClick={() => handleCrossCheck(id)}
                  disabled={loading || txLoading}
                  className="rounded border border-zinc-700 px-2 py-1 text-xs hover:border-zinc-500"
                >
                  {t.cases.crossCheck}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected?.case_id && (
        <div className="card space-y-2">
          <h2 className="font-semibold">
            {t.cases.detail}: {selected.case_id}
          </h2>
          <p className="text-sm">
            {t.cases.tampered}:{" "}
            {selected.tampered ? (
              <span className="badge-bad">{t.cases.yes}</span>
            ) : (
              <span className="badge-ok">{t.cases.no}</span>
            )}
          </p>
          <pre className="overflow-x-auto rounded bg-zinc-900 p-3 text-xs text-zinc-300">
            {JSON.stringify(selected, null, 2)}
          </pre>
        </div>
      )}

      <Alert message={message} tone={messageTone} />
    </div>
  );
}
