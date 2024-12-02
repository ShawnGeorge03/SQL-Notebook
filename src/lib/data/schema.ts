import Dexie, { type EntityTable } from "dexie";

const iDbName = "sql-note" as const;

interface SQLNoteDatabaseBase {
    name: string;
    persistent: boolean;
    createdOn: string;
    lastUsedOn: string;
}

type SQLNoteDatabase =
    | (SQLNoteDatabaseBase & { engine: "pgsql"; system: "pglite" })
    | (SQLNoteDatabaseBase & { engine: "sqlite"; system: "wa-sqlite" })
    | (SQLNoteDatabaseBase & { engine: "duckdb"; system: "duckdb-wasm" });

const sqlNoteDB = new Dexie(iDbName) as Dexie & {
    databases: EntityTable<SQLNoteDatabase, 'name'>;
}

sqlNoteDB.version(1).stores({
    databases: "&name, engine, system, persistent, createdOn, lastUsedOn"
})

export { iDbName, sqlNoteDB };
export type { SQLNoteDatabase };
