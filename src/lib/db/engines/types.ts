export type DBOptions = {
	persistent: boolean;
};

export type QueryResult = {
	data?: unknown;
	error?: string;
	elapsed?: number;
};

/**
 * Interface for classes that represent a Database
 *
 * @interface
 */
export interface DBStrategy {
	db: unknown;
	dbName: string;

	init(): Promise<void>;
	exec(query: string): Promise<QueryResult>;
	close(): Promise<void>;
}
