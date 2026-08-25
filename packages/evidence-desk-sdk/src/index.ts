export type CaseSummary = {
  total: number;
  open: number;
  closed: number;
  clean: number;
  tampered: number;
  updatedAt: string;
};

export type CasesPage = {
  ids: string[];
  count: number;
  total: number;
  nextCursor: string | null;
};

export type EvidenceDeskClientOptions = {
  baseUrl: string;
};

export class EvidenceDeskClient {
  constructor(private opts: EvidenceDeskClientOptions) {}

  async listCases(cursor?: string | null, limit = 20): Promise<CasesPage> {
    const q = new URLSearchParams({ limit: String(limit) });
    if (cursor) q.set("cursor", cursor);
    const res = await fetch(`${this.opts.baseUrl}/api/cases?${q}`);
    if (!res.ok) throw new Error(`listCases failed: ${res.status}`);
    return res.json() as Promise<CasesPage>;
  }

  async getSummary(): Promise<CaseSummary> {
    const res = await fetch(`${this.opts.baseUrl}/api/cases/summary`);
    if (!res.ok) throw new Error(`getSummary failed: ${res.status}`);
    return res.json() as Promise<CaseSummary>;
  }

  async validateHistory(ids: string[]): Promise<{ valid: string[] }> {
    const res = await fetch(`${this.opts.baseUrl}/api/history?ids=${ids.join(",")}`);
    if (!res.ok) throw new Error(`validateHistory failed: ${res.status}`);
    return res.json() as Promise<{ valid: string[] }>;
  }
}

export function createClient(baseUrl: string) {
  return new EvidenceDeskClient({ baseUrl });
}
