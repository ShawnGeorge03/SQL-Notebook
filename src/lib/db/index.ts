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

export class DatabaseContext<T> {
	private dbStrategy!: DatabaseStrategy<T>;

	setStrategy(strategy: DatabaseStrategy<T>) {
		this.dbStrategy = strategy;
	}

	async init() {
		await this.dbStrategy.init();
	}

	async exec(query: string): Promise<QueryResult> {
		return await this.dbStrategy.exec(query);
	}

	async close(): Promise<void> {
		this.dbStrategy.close();
	}
}
