export class EvidenceDeskClient {
    constructor(opts) {
        this.opts = opts;
    }
    async listCases(cursor, limit = 20) {
        const q = new URLSearchParams({ limit: String(limit) });
        if (cursor)
            q.set("cursor", cursor);
        const res = await fetch(`${this.opts.baseUrl}/api/cases?${q}`);
        if (!res.ok)
            throw new Error(`listCases failed: ${res.status}`);
        return res.json();
    }
    async getSummary() {
        const res = await fetch(`${this.opts.baseUrl}/api/cases/summary`);
        if (!res.ok)
            throw new Error(`getSummary failed: ${res.status}`);
        return res.json();
    }
    async validateHistory(ids) {
        const res = await fetch(`${this.opts.baseUrl}/api/history?ids=${ids.join(",")}`);
        if (!res.ok)
            throw new Error(`validateHistory failed: ${res.status}`);
        return res.json();
    }
}
export function createClient(baseUrl) {
    return new EvidenceDeskClient({ baseUrl });
}
