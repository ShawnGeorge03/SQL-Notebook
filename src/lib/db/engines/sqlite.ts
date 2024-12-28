import * as WaSQLite from 'wa-sqlite';
import SQLiteESMFactory from 'wa-sqlite/dist/wa-sqlite-async.mjs';
import IDBBatchAtomicVFS from './thrid-party/wa-sqlite/IDBBatchAtomicVFS.js';
import MemoryAsyncVFS from './thrid-party/wa-sqlite/MemoryAsyncVFS.js';
import { NotebookType, type DBOptions, type DBStrategy, type QueryResult } from './types';

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
     * @returns {Promise{QueryResult[]}} - Promise Object reprsenting the query results.
     */
    async exec(query: string): Promise<QueryResult[]> {
        try {
            if (!this.#db)
                throw new Error('Database not initialized');

            const data: QueryResult[] = [];

            await this.#sqlite3.exec(this.#db, 'BEGIN TRANSACTION;')

            for await (const stmt of this.#sqlite3.statements(this.#db, query)) {
                const rows = [];
                const colNames = this.#sqlite3.column_names(stmt);
                const colTypes: Record<string, Record<string, number>> =
                    colNames.reduce((acc, cur) => ({ ...acc, [cur]: {} }), {});

                while (await this.#sqlite3.step(stmt) === WaSQLite.SQLITE_ROW) {
                    const row = this.#sqlite3.row(stmt);
                    rows.push(row);
                    let col_num = 0;

                    while (col_num !== Object.keys(colTypes).length) {
                        const colName = colNames[col_num];
                        const colType = this.#columnToTypes(await this.#sqlite3.column_type(stmt, col_num))

                        if (!Object.keys(colTypes).includes(colName))
                            colTypes[colName] = {};

                        if (!Object.keys(colTypes[colName]).includes(colType))
                            colTypes[colName] = {
                                ...colTypes[colName],
                                [colType]: 0,
                            }

                        colTypes[colName][colType] += 1;
                        col_num += 1;
                    }
                }

                const cols = []

                for (const colName of colNames) {
                    const colType = colTypes[colName];
                    let maxKey, maxValue = -Infinity;

                    for (const type in colType) {
                        if (colType[type] > maxValue) {
                            maxKey = type;
                            maxValue = colType[type];
                        }
                    }

                    cols.push({
                        name: colName,
                        type: maxKey
                    })
                }

                data.push({ rows, cols: cols as QueryResult['cols'] });
            }

            await this.#sqlite3.exec(this.#db, 'COMMIT;')

            return data;
        } catch (error) {
            await this.#sqlite3.exec(this.#db, 'ROLLBACK;')

            if (error instanceof Error) {
                if (error.cause) {
                    throw new Error(error.message + ' (' + error.cause + ')');
                } else {
                    throw new Error(error.message);
                }
            } else {
                throw new Error(`Database query failed: ${String(error)}`);
            }
        }
    }

    #columnToTypes(field: number) {
        switch (field) {
            case WaSQLite.SQLITE_NULL:
                return NotebookType.BOOLEAN
            case WaSQLite.SQLITE_INTEGER:
            case WaSQLite.SQLITE_FLOAT:
                return NotebookType.NUMBER
            case WaSQLite.SQLITE_TEXT:
                return NotebookType.STRING;
            default:
                return NotebookType.STRING;
        }
    }

    /**
     * Closes the Database.
     */
    async close(): Promise<void> {
        await this.#sqlite3.close(this.#db);
    }

}