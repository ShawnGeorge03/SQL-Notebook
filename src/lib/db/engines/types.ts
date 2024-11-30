export type QueryResult = {
    data?: unknown;
    error?: string;
    elapsed?: number;
};

export interface DBStrategy {
    db: unknown;
    dbName: string;

    init(): Promise<void>;
    exec(query: string): Promise<QueryResult>;
    close(): Promise<void>;
}

export type DBEngineOptions = {
    persistent: boolean
}