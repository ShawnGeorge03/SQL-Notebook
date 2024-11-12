export type DBOptions = Record<string, string | boolean | number>;

export type QueryResult = {
	data?: unknown;
	error?: string;
	elapsed?: number;
};
