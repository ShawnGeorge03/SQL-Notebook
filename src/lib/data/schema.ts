import Dexie, { type EntityTable } from 'dexie';

const iDbName = 'sql-note' as const;

interface BaseTable {
    id: number;
    name: string;
    createdOn: string;
    modifiedOn: string;
};

type BaseDatabase = Omit<BaseTable, 'id'> & { persistent: boolean };

type Database =
    | (BaseDatabase & { engine: 'pgsql'; system: 'pglite' })
    | (BaseDatabase & { engine: 'sqlite'; system: 'wa-sqlite' })
    | (BaseDatabase & { engine: 'duckdb'; system: 'duckdb-wasm' });

type Project = BaseTable & { notebooks: number[] };

type NotebookData =
    | {
        cell: 'sql';
        dbName?: string;
        content: string;
    }
    | {
        cell: 'text';
        content: string;
    }

type Notebook = BaseTable & {
    projectID: number;
    size: number;
    data: NotebookData[]
};

const sqlNoteDB = new Dexie(iDbName) as Dexie & {
    databases: EntityTable<Database, 'name'>;
    notebooks: EntityTable<Notebook, 'id'>;
    projects: EntityTable<Project, 'id'>;
};

sqlNoteDB.version(1).stores({
    databases: '&name, createdOn, modifiedOn, engine, system, persistent',
    notebooks: '++id, name, createdOn, modifiedOn, size',
    projects: '++id, name, createdOn, modifiedOn'
});

export { iDbName, sqlNoteDB };
