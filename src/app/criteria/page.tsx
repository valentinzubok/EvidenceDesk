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
} from "@/components/ui";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import { getCriteriaBody, listTopTemplates } from "@/lib/contracts";
import { formatReadError } from "@/lib/errors";
import { tScoreUses } from "@/lib/i18n/messages";
import { markdownPreview } from "@/lib/preview";
import type { CriteriaTemplate } from "@/lib/types";

export default function CriteriaPage() {
  const { t, locale } = useLocale();
  const { push } = useToast();
  const [templates, setTemplates] = useState<CriteriaTemplate[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [bodyLoading, setBodyLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"warn" | "ok">("warn");
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "uses" | "recent">("score");

  const loadPreviews = useCallback(async (items: CriteriaTemplate[]) => {
    const slice = items.slice(0, 10);
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
      if (items[0]) setSelectedId((prev) => prev ?? items[0].id);
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

  const allTags = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t) => t.tags?.forEach((tag) => set.add(tag)));
    return [...set].sort();
  }, [templates]);

  const filtered = useMemo(() => {
    let list = [...templates];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (item) =>
          item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(q)),
      );
    }
    if (tagFilter) {
      list = list.filter((item) => item.tags?.includes(tagFilter));
    }
    if (sortBy === "score") list.sort((a, b) => b.score - a.score);
    else if (sortBy === "uses") list.sort((a, b) => b.uses - a.uses);
    return list;
  }, [templates, search, tagFilter, sortBy]);

  async function copyBody() {
    if (!body) return;
    await navigator.clipboard.writeText(body);
    setMessageTone("ok");
    setMessage(t.criteria.copied);
    push(t.criteria.copied, "ok");
  }

  async function copyId() {
    if (!selectedId) return;
    await navigator.clipboard.writeText(selectedId);
    push(t.criteria.copiedId, "ok");
  }

  return (
    <div className="space-y-8">
      <LoadingOverlay show={loading && templates.length === 0} label={t.criteria.loading} />

      <PageHero title={t.criteria.title} subtitle={t.criteria.subtitle} />

      <GlassCard className="animate-fade-up space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">{t.criteria.top}</h2>
          <button type="button" onClick={load} className="btn-icon">
            ↻ {t.criteria.refresh}
          </button>
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder={t.criteria.search} />
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-xs text-zinc-500">
            {t.criteria.filterTag}
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="!w-auto min-w-[140px] !py-2 text-sm"
            >
              <option value="">{t.criteria.allTags}</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-zinc-500">
            {t.criteria.sortBy}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "score" | "uses" | "recent")}
              className="!w-auto min-w-[140px] !py-2 text-sm"
            >
              <option value="score">{t.criteria.sortScore}</option>
              <option value="uses">{t.criteria.sortUses}</option>
              <option value="recent">{t.criteria.sortRecent}</option>
            </select>
          </label>
        </div>
        {loading && templates.length === 0 ? (
          <Spinner label={t.criteria.loading} />
        ) : filtered.length === 0 ? (
          <EmptyState message={search ? t.common.error : t.criteria.noTemplates} />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {filtered.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`group h-full w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                    selectedId === item.id
                      ? "border-teal-500/50 bg-gradient-to-br from-teal-500/15 to-transparent shadow-lg shadow-teal-500/10"
                      : "border-white/5 bg-black/20 hover:border-teal-500/25 hover:bg-teal-500/5"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-sm text-teal-300">{item.id}</span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-500">
                      {tScoreUses(t.criteria.scoreUses, item.score, item.uses)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white group-hover:text-teal-100">
                    {item.title}
                  </p>
                  {previews[item.id] ? (
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-500">
                      {previews[item.id]}
                    </p>
                  ) : (
                    <div className="mt-2 h-8 animate-shimmer rounded" />
                  )}
                  {item.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400"
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
      </GlassCard>

      {selectedId ? (
        <GlassCard className="animate-fade-up space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">
              get_body(<span className="font-mono text-teal-300">{selectedId}</span>)
            </h2>
            <div className="flex gap-2">
              <button type="button" onClick={copyId} className="btn-icon">
                {t.criteria.copyId}
              </button>
              <button
                type="button"
                onClick={copyBody}
                className="btn-primary !py-1.5 !px-3 !text-xs"
              >
                {t.criteria.copy}
              </button>
            </div>
          </div>
          <p className="text-xs text-zinc-500">{t.criteria.previewHint}</p>
          {bodyLoading ? (
            <Spinner label={t.common.loading} />
          ) : (
            <pre className="max-h-96 overflow-auto rounded-xl border border-white/5 bg-black/40 p-4 text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
              {body || t.criteria.emptyBody}
            </pre>
          )}
        </GlassCard>
      ) : null}

      <Alert message={message} tone={messageTone} />
    </div>
  );
}
