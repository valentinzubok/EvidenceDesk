"use client";

import { useEffect, useMemo, useState } from "react";
import { DEMO_URL } from "@/lib/config";
import { MAX_URLS_PER_CASE } from "@/lib/limits";
import { tValidation } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/messages";
import { isValidCaseId, parseUrlsJson, sanitizeCaseId } from "@/lib/validate";
import { useLocale } from "./LocaleProvider";
import { Spinner } from "./ui";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (caseId: string, urlsJson: string) => Promise<void>;
  submitting: boolean;
};

function generateCaseId(): string {
  return `case-${Date.now().toString(36)}`;
}

export function CaseWizard({ open, onClose, onSubmit, submitting }: Props) {
  const { t, locale } = useLocale();
  const w = t.wizard;
  const [step, setStep] = useState(0);
  const [caseId, setCaseId] = useState("demo-desk-1");
  const [urlInput, setUrlInput] = useState("");
  const [urls, setUrls] = useState<string[]>([DEMO_URL]);
  const [error, setError] = useState("");

  const steps = [w.stepId, w.stepUrls, w.stepReview];

  useEffect(() => {
    if (open) {
      setStep(0);
      setCaseId("demo-desk-1");
      setUrlInput("");
      setUrls([DEMO_URL]);
      setError("");
    }
  }, [open]);

  function resetAndClose() {
    setStep(0);
    setError("");
    onClose();
  }

  function validateUrl(raw: string, loc: Locale): string | null {
    const parsed = parseUrlsJson(JSON.stringify([raw.trim()]));
    if (!parsed.ok) return tValidation(loc, parsed.error);
    return null;
  }

  function addUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (urls.length >= MAX_URLS_PER_CASE) {
      setError(tValidation(locale, "too_many_urls"));
      return;
    }
    const err = validateUrl(trimmed, locale);
    if (err) {
      setError(err);
      return;
    }
    setUrls((prev) => [...new Set([...prev, trimmed])]);
    setUrlInput("");
    setError("");
  }

  function removeUrl(u: string) {
    setUrls((prev) => prev.filter((x) => x !== u));
  }

  async function handleSubmit() {
    const id = sanitizeCaseId(caseId);
    if (!isValidCaseId(id)) {
      setError(t.cases.invalidCaseId);
      return;
    }
    const parsed = parseUrlsJson(JSON.stringify(urls));
    if (!parsed.ok) {
      setError(`${t.cases.invalidUrls}: ${tValidation(locale, parsed.error)}`);
      return;
    }
    setError("");
    await onSubmit(id, JSON.stringify(parsed.urls));
    resetAndClose();
  }

  const reviewJson = useMemo(() => JSON.stringify(urls, null, 2), [urls]);

  if (!open) return null;

  return (
    <div
      className="overlay-backdrop fixed inset-0 z-[70] flex items-end justify-center p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal
    >
      <div className="glass-card max-h-[92vh] w-full max-w-lg overflow-y-auto animate-fade-up rounded-t-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-teal-400">{w.title}</p>
            <p className="mt-1 text-sm text-zinc-400">
              {w.stepOf.replace("{n}", String(step + 1)).replace("{total}", String(steps.length))}:{" "}
              {steps[step]}
            </p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="btn-icon !border-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          {steps.map((_, i) => (
            <div
              key={steps[i]}
              className={`h-1 flex-1 rounded-full transition ${i <= step ? "bg-teal-500" : "bg-zinc-800"}`}
            />
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {step === 0 && (
            <>
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
                    className="btn-icon shrink-0"
                  >
                    {t.cases.generateId}
                  </button>
                </div>
              </label>
              <p className="text-xs text-zinc-500">{w.idHint}</p>
            </>
          )}

          {step === 1 && (
            <>
              <div className="flex gap-2">
                <input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://..."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
                />
                <button type="button" onClick={addUrl} className="btn-primary shrink-0 !px-3">
                  {w.add}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUrls([DEMO_URL]);
                  setError("");
                }}
                className="btn-icon text-xs"
              >
                {t.cases.addUrl}
              </button>
              <p className="text-xs text-zinc-500">
                {w.urlLimit} ({urls.length}/{MAX_URLS_PER_CASE})
              </p>
              <ul className="max-h-40 space-y-2 overflow-y-auto">
                {urls.map((u) => (
                  <li
                    key={u}
                    className="surface-deep flex items-start gap-2 rounded-lg border border-white/5 p-2 text-xs"
                  >
                    <span className="flex-1 break-all text-teal-300/90">{u}</span>
                    <button
                      type="button"
                      onClick={() => removeUrl(u)}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              {urls.length === 0 ? <p className="text-xs text-amber-400">{w.noUrls}</p> : null}
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-zinc-400">
                <span className="text-zinc-200">{t.cases.caseId}:</span>{" "}
                <span className="font-mono text-teal-300">{caseId}</span>
              </p>
              <pre className="surface-code max-h-48 overflow-auto rounded-xl p-3 text-xs">
                {reviewJson}
              </pre>
              <p className="text-xs text-zinc-500">{w.reviewHint}</p>
            </>
          )}

          {error ? <p className="text-sm text-amber-300">{error}</p> : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="btn-ghost"
              disabled={submitting}
            >
              {w.back}
            </button>
          ) : (
            <button type="button" onClick={resetAndClose} className="btn-ghost">
              {w.cancel}
            </button>
          )}
          <div className="flex-1" />
          {step < 2 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 0 && !isValidCaseId(sanitizeCaseId(caseId))) {
                  setError(t.cases.invalidCaseId);
                  return;
                }
                if (step === 1 && urls.length === 0) {
                  setError(w.noUrls);
                  return;
                }
                if (step === 1) {
                  const parsed = parseUrlsJson(JSON.stringify(urls));
                  if (!parsed.ok) {
                    setError(tValidation(locale, parsed.error));
                    return;
                  }
                }
                setError("");
                setStep((s) => s + 1);
              }}
              className="btn-primary"
            >
              {w.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary min-w-[120px]"
            >
              {submitting ? <Spinner size="sm" /> : t.cases.openCase}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
