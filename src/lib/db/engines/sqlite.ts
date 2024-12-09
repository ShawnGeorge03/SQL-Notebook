import { iDB } from '$lib/indexeddb/schema';
import * as WaSQLite from 'wa-sqlite';
import SQLiteESMFactory from 'wa-sqlite/dist/wa-sqlite-async.mjs';
import IDBBatchAtomicVFS from './thrid-party/wa-sqlite/IDBBatchAtomicVFS.js';
import MemoryAsyncVFS from './thrid-party/wa-sqlite/MemoryAsyncVFS.js';
import type { DBOptions, DBStrategy, QueryResult } from './types';

/** Class representing a SQLite Database.
 *
 * @class
 * @implements {DBStrategy}
 */
export class SQLite implements DBStrategy {
    #db!: number;
    #dbName: string;
    #dbOptions: DBOptions;
    #sqlite3!: SQLiteAPI;

    /**
     * Creates a SQLite object.
     *
     * @param {string} dbName - The name of the database.
     * @param {DBOptions} dbOptions - The options for the database.
     */
    constructor(dbName: string, dbOptions: DBOptions) {
        this.#dbName = dbName;
        this.#dbOptions = dbOptions;
    }

    /**
     * Initializes a PostgreSQL Database.
     *
     * @throws {Error} Will throw an Error if the database cannot be initialized.
     */
    async init(): Promise<void> {
        try {
            const module = await SQLiteESMFactory();
            this.#sqlite3 = WaSQLite.Factory(module);

            const vfs = this.#dbOptions.persistent ? await IDBBatchAtomicVFS.create(this.#dbName, module, { lockPolicy: 'shared+hint' }) : await MemoryAsyncVFS.create(this.#dbName, module);
            this.#sqlite3.vfs_register(vfs as SQLiteVFS, true);

            this.#db = await this.#sqlite3.open_v2(this.#dbName);

            await iDB.transaction('readwrite', iDB.databases, async () => {
                await iDB.databases.add({
                    'name': this.#dbName,
                    'createdBy': 'sql-notebook',
                    'createdOn': new Date().toISOString(),
                    'modifiedOn': new Date().toISOString(),
                    'persistent': this.#dbOptions.persistent,
                    'engine': 'sqlite',
                    'system': 'wa-sqlite'
                });
            });
        } catch (error) {
            const initError =
                error instanceof Error
                    ? error
                    : new Error(`Database initialization failed: ${String(error)}`);

            throw initError;
        }
    }

    /**
     * Return the results from a query.
     *
     * All queries will be run within a transaction to
     * ensure failed queries do not cause issues to the
     * database.
     *
     * @param {string} query - The query to be run.
     *
     * @returns {Promise{QueryResult}} - Promise Object reprsenting the query results.
     */
    async exec(query: string): Promise<QueryResult> {
        try {
            if (!this.#db) throw new Error('Database not initialized');

            const startTime = performance.now();
            const results = [];
            for await (const stmt of this.#sqlite3.statements(this.#db, query)) {
                const rows = [];
                while (await this.#sqlite3.step(stmt) === WaSQLite.SQLITE_ROW) {
                    const row = this.#sqlite3.row(stmt);
                    rows.push(row);
                }

                const columns = this.#sqlite3.column_names(stmt)
                if (columns.length) {
                    results.push({ columns, rows });
                }
            }

            return {
                data: { results },
                elapsed: performance.now() - startTime
            };
        } catch (error) {
            let queryError = '';
            if (error instanceof Error) {
                queryError = error.message;
                if (error.cause) queryError += ' (' + error.cause + ')';
            } else {
                queryError = `Database query failed: ${String(error)}`;
            }
            return { error: queryError };
        }
    }

    /**
     * Closes the Database.
     */
    async close(): Promise<void> {
        await this.#sqlite3.close(this.#db);
    }

}