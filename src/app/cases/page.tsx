"use client";

import { useCallback, useEffect, useState } from "react";
import { DEMO_URL, SNAPSHOT_ADDRESS } from "@/lib/config";
import { readContract, writeAndWait } from "@/lib/genlayer";
import { useWallet } from "@/components/WalletProvider";

type CaseRow = {
  case_id: string;
  tampered?: boolean;
  has_ok_snapshot?: boolean;
  items?: { url: string; content_hash: string; preview: string; status: string }[];
};

export default function CasesPage() {
  const { address, provider } = useWallet();
  const [caseIds, setCaseIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<CaseRow | null>(null);
  const [caseId, setCaseId] = useState("demo-desk-1");
  const [urlsJson, setUrlsJson] = useState(JSON.stringify([DEMO_URL]));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<{ cases: number; tampered: number; clean: number } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const rawIds = await readContract<string>(SNAPSHOT_ADDRESS, "list_cases", []);
      const ids = JSON.parse(rawIds || "[]") as string[];
      setCaseIds(ids);

      const rawStats = await readContract<string>(SNAPSHOT_ADDRESS, "get_stats", []);
      setStats(JSON.parse(rawStats || "{}"));

      if (ids.length > 0) {
        const rawCase = await readContract<string>(SNAPSHOT_ADDRESS, "get_case", [ids[ids.length - 1]]);
        setSelected(JSON.parse(rawCase || "{}"));
      } else {
        setSelected(null);
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to load cases");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function loadCase(id: string) {
    const raw = await readContract<string>(SNAPSHOT_ADDRESS, "get_case", [id]);
    setSelected(JSON.parse(raw || "{}"));
  }

  async function handleOpenCase() {
    if (!address || !provider) {
      setMessage("Connect wallet first");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const tx = await writeAndWait(address, provider, SNAPSHOT_ADDRESS, "open_case", [
        caseId,
        urlsJson,
      ]);
      setMessage(`open_case submitted: ${tx}`);
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "open_case failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCrossCheck(id: string) {
    if (!address || !provider) {
      setMessage("Connect wallet first");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const tx = await writeAndWait(address, provider, SNAPSHOT_ADDRESS, "cross_check", [id]);
      setMessage(`cross_check submitted: ${tx}`);
      await loadCase(id);
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "cross_check failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Evidence Cases</h1>
        <p className="text-sm text-zinc-400">
          Read/write EvidenceSnapshot on Studionet via genlayer-js + MetaMask.
        </p>
      </div>

      {stats && (
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="badge-ok">Cases: {stats.cases}</span>
          <span className="badge-ok">Clean: {stats.clean}</span>
          {stats.tampered > 0 && <span className="badge-bad">Tampered: {stats.tampered}</span>}
        </div>
      )}

      <div className="card space-y-3">
        <h2 className="font-semibold">Open new case</h2>
        <label className="block text-sm text-zinc-400">
          case_id
          <input value={caseId} onChange={(e) => setCaseId(e.target.value)} className="mt-1" />
        </label>
        <label className="block text-sm text-zinc-400">
          urls_json
          <textarea value={urlsJson} onChange={(e) => setUrlsJson(e.target.value)} rows={2} className="mt-1 font-mono text-xs" />
        </label>
        <button
          type="button"
          onClick={handleOpenCase}
          disabled={loading}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500"
        >
          open_case
        </button>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">On-chain cases</h2>
          <button type="button" onClick={load} className="text-sm text-teal-400 hover:underline">
            Refresh
          </button>
        </div>
        {caseIds.length === 0 ? (
          <p className="text-sm text-zinc-500">No cases yet.</p>
        ) : (
          <ul className="space-y-2">
            {caseIds.map((id) => (
              <li key={id} className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-800 p-3">
                <button type="button" onClick={() => loadCase(id)} className="font-mono text-sm text-teal-300 hover:underline">
                  {id}
                </button>
                <button
                  type="button"
                  onClick={() => handleCrossCheck(id)}
                  disabled={loading}
                  className="rounded border border-zinc-700 px-2 py-1 text-xs hover:border-zinc-500"
                >
                  cross_check
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected?.case_id && (
        <div className="card space-y-2">
          <h2 className="font-semibold">Case detail: {selected.case_id}</h2>
          <p className="text-sm">
            Tampered:{" "}
            {selected.tampered ? <span className="badge-bad">yes</span> : <span className="badge-ok">no</span>}
          </p>
          <pre className="overflow-x-auto rounded bg-zinc-900 p-3 text-xs text-zinc-300">
            {JSON.stringify(selected, null, 2)}
          </pre>
        </div>
      )}

      {message && <p className="text-sm text-amber-300 break-all">{message}</p>}
    </div>
  );
}
