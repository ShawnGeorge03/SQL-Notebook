import type { QueryResult } from '$lib/db/engines/types';
import type { DBEngine } from '$lib/db/worker/types';

interface BaseTable {
	id: number;
	name: string;
	createdBy: 'user' | 'sql-notebook';
	createdOn: string;
	modifiedOn: string;
}

type BaseDatabase = Omit<BaseTable, 'id'> & { persistent: boolean };

export type Database =
	| (BaseDatabase & { engine: DBEngine.PGSQL; system: 'pglite' })
	| (BaseDatabase & { engine: DBEngine.SQLITE; system: 'wa-sqlite' });

export type Project = BaseTable & { notebookIDs: number[] };

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
}

type MarkdownCell = {
	id: string;
	cellType: 'markdown';
	content: {
		name: string;
		text: string;
	};
}

export type NotebookCell = QueryCell | MarkdownCell;

export type Notebook = BaseTable & {
	projectID: number;
	cells: NotebookCell[];
};
