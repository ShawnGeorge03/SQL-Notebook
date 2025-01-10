import type { QueryResult } from '$lib/db/engines/types';
import type { DBEngine } from '$lib/db/worker/types';

export interface BaseTable {
	id: string;
	name: string;
	createdBy: 'user' | 'sql-notebook';
	createdOn: string;
	modifiedOn: string;
}

type BaseDatabase = BaseTable & {
	persistent: boolean;
	status: 'UNAVAILABLE' | 'LOADING' | 'AVAILABLE';
};

export type Database =
	| (BaseDatabase & { engine: DBEngine.PGSQL; system: 'pglite' })
	| (BaseDatabase & { engine: DBEngine.SQLITE; system: 'wa-sqlite' });

type QueryCell = {
	id: string;
	cellType: 'query';
	content: {
		name: string;
		query: string;
		dbName: string;
		engine: DBEngine;
		result?: QueryResult;
	};
};

type MarkdownCell = {
	id: string;
	cellType: 'markdown';
	content: {
		name: string;
		text: string;
	};
};

export type NotebookCell = QueryCell | MarkdownCell;

export type Notebook = BaseTable & {
	cells: NotebookCell[];
};
