export type DBOptions = {
	persistent: boolean;
};

export enum NotebookType {
	BOOLEAN = 'boolean',
	NUMBER = 'number',
	DATE = 'date',
	TIME = 'time',
	DATETIME = 'datetime',
	STRING = 'string'
}

export type QueryResult = {
	rows: unknown[];
	cols: { name: string; type: NotebookType }[];
};

/**
 * Interface for classes that represent a Database
 *
 * @interface
 */
export interface DBStrategy {
	init(): Promise<void>;
	exec(query: string): Promise<QueryResult>;
	close(): Promise<void>;
}
