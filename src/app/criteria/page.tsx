"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, LoadingOverlay, Spinner } from "@/components/ui";
import { useLocale } from "@/components/LocaleProvider";
import { getCriteriaBody, listTopTemplates } from "@/lib/contracts";
import { formatReadError } from "@/lib/errors";
import { tScoreUses } from "@/lib/i18n/messages";
import { markdownPreview } from "@/lib/preview";
import type { CriteriaTemplate } from "@/lib/types";

export default function CriteriaPage() {
  const { t, locale } = useLocale();
  const [templates, setTemplates] = useState<CriteriaTemplate[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [bodyLoading, setBodyLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"warn" | "ok">("warn");

  const loadPreviews = useCallback(async (items: CriteriaTemplate[]) => {
    const slice = items.slice(0, 8);
    const entries = await Promise.all(
      slice.map(async (item) => {
        try {
          const text = await getCriteriaBody(item.id);
          return [item.id, markdownPreview(text)] as const;
        } catch {
          return [item.id, ""] as const;
        }
      }),
    );
    setPreviews(Object.fromEntries(entries));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const parsed = await listTopTemplates(20);
      const items = parsed.items || [];
      setTemplates(items);
      if (items[0]) setSelectedId(items[0].id);
      void loadPreviews(items);
    } catch (e) {
      setMessage(formatReadError(e, locale));
    } finally {
      setLoading(false);
    }
  }, [locale, loadPreviews]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!selectedId) return;
    setBodyLoading(true);
    getCriteriaBody(selectedId)
      .then(setBody)
      .catch(() => setBody(""))
      .finally(() => setBodyLoading(false));
  }, [selectedId]);

  async function copyBody() {
    if (!body) return;
    await navigator.clipboard.writeText(body);
    setMessageTone("ok");
    setMessage(t.criteria.copied);
  }

  return (
    <div className="space-y-6">
      <LoadingOverlay show={loading && templates.length === 0} label={t.criteria.loading} />

      <div>
        <h1 className="text-2xl font-bold">{t.criteria.title}</h1>
        <p className="text-sm text-zinc-400">{t.criteria.subtitle}</p>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{t.criteria.top}</h2>
          <button type="button" onClick={load} className="text-sm text-teal-400 hover:underline">
            {t.criteria.refresh}
          </button>
        </div>
        {loading && templates.length === 0 ? (
          <Spinner label={t.criteria.loading} />
        ) : templates.length === 0 ? (
          <p className="text-sm text-zinc-500">{t.criteria.noTemplates}</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {templates.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`h-full w-full rounded-lg border p-3 text-left transition ${
                    selectedId === item.id
                      ? "border-teal-600 bg-teal-950/30"
                      : "border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-sm text-teal-300">{item.id}</span>
                    <span className="text-xs text-zinc-500">
                      {tScoreUses(t.criteria.scoreUses, item.score, item.uses)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-zinc-200">{item.title}</p>
                  {previews[item.id] ? (
                    <p className="mt-2 line-clamp-3 text-xs text-zinc-500">{previews[item.id]}</p>
                  ) : null}
                  {item.tags?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedId && (
        <div className="card space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">get_body({selectedId})</h2>
            <button
              type="button"
              onClick={copyBody}
              className="rounded border border-zinc-700 px-3 py-1 text-xs hover:border-zinc-500"
            >
              {t.criteria.copy}
            </button>
          </div>
          <p className="text-xs text-zinc-500">{t.criteria.previewHint}</p>
          {bodyLoading ? (
            <Spinner label={t.common.loading} />
          ) : (
            <pre className="overflow-x-auto rounded bg-zinc-900 p-3 text-xs text-zinc-300 whitespace-pre-wrap">
              {body || "(empty or deprecated)"}
            </pre>
          )}
        </div>
      )}

      <Alert message={message} tone={messageTone} />
    </div>
  );
}
