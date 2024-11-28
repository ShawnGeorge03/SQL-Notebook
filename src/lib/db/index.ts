export type DBOptions = Record<string, string | boolean | number>;

export type QueryResult = {
	data?: unknown;
	error?: string;
	elapsed?: number;
};

export interface DatabaseStrategy<T> {
	db: T;
	dbName: string;

	init(): Promise<void>;
	exec(query: string): Promise<QueryResult>;
	close(): Promise<void>;
}