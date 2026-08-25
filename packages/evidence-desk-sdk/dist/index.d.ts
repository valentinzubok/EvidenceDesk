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
export declare class EvidenceDeskClient {
    private opts;
    constructor(opts: EvidenceDeskClientOptions);
    listCases(cursor?: string | null, limit?: number): Promise<CasesPage>;
    getSummary(): Promise<CaseSummary>;
    validateHistory(ids: string[]): Promise<{
        valid: string[];
    }>;
}
export declare function createClient(baseUrl: string): EvidenceDeskClient;
