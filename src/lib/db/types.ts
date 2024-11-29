export type QueryResult = {
	data?: unknown;
	error?: string;
	elapsed?: number;
};

export interface DatabaseStrategy {
	db: unknown;
	dbName: string;

	init(): Promise<void>;
	exec(query: string): Promise<QueryResult>;
	close(): Promise<void>;
}

export type DBOptions = {
	engine: 'pgsql' | 'sqlite' | 'duckdb';
	dbName: string;
	persistent: boolean;
};