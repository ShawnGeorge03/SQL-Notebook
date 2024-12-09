import type { QueryResult } from "$lib/db/engines/types";
export const IDBname = 'sql-notebook' as const;
interface BaseTable {
    id: number;
    name: string;
    createdBy: 'user' | 'sql-notebook'
    createdOn: string;
    modifiedOn: string;
};

type BaseDatabase = Omit<BaseTable, 'id'> & { persistent: boolean };

export type Database =
    | (BaseDatabase & { engine: 'pgsql'; system: 'pglite' })
    | (BaseDatabase & { engine: 'sqlite'; system: 'wa-sqlite' })
    | (BaseDatabase & { engine: 'duckdb'; system: 'duckdb-wasm' });

export type Project = BaseTable & { notebookIDs: number[] };

type NotebookCell =
    | {
        id: string;
        name?: string;
        cell: 'sql';
        content: {
            query: string;
            result: QueryResult;
        }
    }
    | {
        id: string;
        name: string;
        cell: 'text';
        content: string;
    }

export type Notebook = BaseTable & {
    projectID: number;
    cells: NotebookCell[]
};