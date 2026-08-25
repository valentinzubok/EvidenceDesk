"use client";

import { useState } from "react";
import { GlassCard, Spinner } from "@/components/ui";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";

type Props = {
  caseId?: string;
};

export function AiCriteriaAssistant({ caseId }: Props) {
  const { t } = useLocale();
  const { push } = useToast();
  const [description, setDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/suggest-criteria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, caseId }),
      });
      const data = (await res.json()) as { body?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "failed");
      setResult(data.body ?? "");
      push(t.ai.generated, "ok");
    } catch {
      push(t.common.error, "warn");
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    push(t.criteria.copied, "ok");
  }

  return (
    <GlassCard className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">{t.ai.title}</h2>
        <p className="mt-1 text-sm text-zinc-400">{t.ai.subtitle}</p>
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t.ai.placeholder}
        rows={4}
        className="resize-y"
      />
      <button type="button" onClick={generate} disabled={loading} className="btn-primary">
        {loading ? <Spinner size="sm" /> : t.ai.generate}
      </button>
      {result ? (
        <div className="space-y-2">
          <pre className="surface-code max-h-64 overflow-auto rounded-xl p-3 text-xs whitespace-pre-wrap">
            {result}
          </pre>
          <button type="button" onClick={copyResult} className="btn-ghost">
            {t.criteria.copy}
          </button>
        </div>
      ) : null}
    </GlassCard>
  );
}
