"use client";

import { useCallback, useEffect, useState } from "react";
import { REGISTRY_ADDRESS } from "@/lib/config";
import { readContract } from "@/lib/genlayer";

type TemplateRow = {
  id: string;
  title: string;
  score: number;
  uses: number;
  tags?: string[];
};

export default function CriteriaPage() {
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const raw = await readContract<string>(REGISTRY_ADDRESS, "top", ["0", "20"]);
      const parsed = JSON.parse(raw || "{}") as { items: TemplateRow[] };
      setTemplates(parsed.items || []);
      if (parsed.items?.[0]) {
        setSelectedId(parsed.items[0].id);
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to load templates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!selectedId) return;
    readContract<string>(REGISTRY_ADDRESS, "get_body", [selectedId])
      .then(setBody)
      .catch(() => setBody(""));
  }, [selectedId]);

  async function copyBody() {
    if (!body) return;
    await navigator.clipboard.writeText(body);
    setMessage("Criteria copied to clipboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Criteria Templates</h1>
        <p className="text-sm text-zinc-400">
          Read PromptRegistry on Studionet — top templates by score.
        </p>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Top templates</h2>
          <button type="button" onClick={load} className="text-sm text-teal-400 hover:underline">
            Refresh
          </button>
        </div>
        {templates.length === 0 ? (
          <p className="text-sm text-zinc-500">{loading ? "Loading…" : "No templates yet."}</p>
        ) : (
          <ul className="space-y-2">
            {templates.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  className={`w-full rounded-lg border p-3 text-left ${
                    selectedId === t.id ? "border-teal-600 bg-teal-950/30" : "border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-sm text-teal-300">{t.id}</span>
                    <span className="text-xs text-zinc-500">score {t.score} · uses {t.uses}</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-300">{t.title}</p>
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
              Copy criteria
            </button>
          </div>
          <p className="text-xs text-zinc-500">
            Pin this id in your dispute contract or use with EvidenceSnapshot cross_check adjudication.
          </p>
          <pre className="overflow-x-auto rounded bg-zinc-900 p-3 text-xs text-zinc-300 whitespace-pre-wrap">
            {body || "(empty or deprecated)"}
          </pre>
        </div>
      )}

      {message && <p className="text-sm text-amber-300">{message}</p>}
    </div>
  );
}
