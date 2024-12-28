import * as WaSQLite from 'wa-sqlite';
import SQLiteESMFactory from 'wa-sqlite/dist/wa-sqlite-async.mjs';
import IDBBatchAtomicVFS from './thrid-party/wa-sqlite/IDBBatchAtomicVFS.js';
import MemoryAsyncVFS from './thrid-party/wa-sqlite/MemoryAsyncVFS.js';
import { NotebookType, type DBOptions, type DBStrategy, type QueryResult } from './types';

type ColTypes = Record<string, Record<NotebookType, number>>;

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
        if (!this.#db)
            throw new Error('Database not initialized');

        try {
            let data: QueryResult[] = [];
            await this.#sqlite3.exec(this.#db, 'BEGIN TRANSACTION;')
                .then(async () => data = await this.executeQuery(query));
            return await this.#sqlite3.exec(this.#db, 'COMMIT;')
                .then(() => data);
        } catch (error) {
            await this.#sqlite3.exec(this.#db, 'ROLLBACK;');
            if (error instanceof Error) {
                throw new Error(error.cause
                    ? `${error.message} (${error.cause})`
                    : error.message
                );
            }
            throw new Error(`Database query failed: ${String(error)}`);
        }
    }

    /**
     * Executes a SQL query and returns the results.
     *
     * @param {string} query - The SQL query to be executed.
     *
     * @returns {Promise{QueryResult[]}} - A Promise that resolves to an array of
     * `QueryResult` objects representing the results of the executed query.
     */
    private async executeQuery(query: string): Promise<QueryResult[]> {
        const data: QueryResult[] = [];

        for await (const statement of this.#sqlite3.statements(this.#db, query)) {
            const colNames = this.#sqlite3.column_names(statement);
            const { rows, colTypes } = await this.executeStatement(statement, colNames);
            if (rows.length > 0 || colNames.length > 0)
                data.push({ rows, cols: this.getColumnMetadata(colNames, colTypes) });
        }

        return data;
    }

    /**
     * Executes a SQL statement and returns the results.
     *
     * @param {number} statement - The prepared SQLite statement.
     * @param {srting[]} colNames - The column names.
     *
     * @returns {Promise<{ rows: unknown[], colTypes: ColTypes }>} The results of the query.
     */
    private async executeStatement(statement: number, colNames: string[]) {
        const rows: unknown[] = [];
        const colTypes: ColTypes = colNames.reduce((acc, cur) => ({ ...acc, [cur]: {} }), {});

        while (await this.#sqlite3.step(statement) === WaSQLite.SQLITE_ROW) {
            rows.push(this.#sqlite3.row(statement));
            for (let i = 0; i < colNames.length; i++) {
                const colName = colNames[i];
                const sqliteColType = await this.#sqlite3.column_type(statement, i);
                const notebookColType = this.mapSQLiteTypesToNotebookTypes(sqliteColType);
                colTypes[colName][notebookColType] = (colTypes[colName][notebookColType] || 0) + 1;
            }
        }

        return { rows, colTypes };
    }

    /**
     * Returns the column metadata for a query result.
     *
     * @param {srting[]} colNames - The column names.
     * @param {ColTypes} colTypes - The column types.
     *
     * @returns {QueryResult['cols']} The column metadata.
     */
    private getColumnMetadata(colNames: string[], colTypes: ColTypes): QueryResult['cols'] {
        return colNames.map(name => {
            const typeFrequencies = colTypes[name];

            const [maxType] = Object.entries(typeFrequencies).reduce(
                ([currentType, currentCount], [type, count]) =>
                    count > currentCount ? [type, count] : [currentType, currentCount],
                [NotebookType.STRING, -Infinity]
            );

            return { name, type: maxType as NotebookType };
        });
    }

    /**
     * Maps SQLite column types to Notebook types.
     *
     * @param {number} colType - The SQLite column type to be mapped.
     *
     * @returns {NotebookType} The mapped Notebook type.
     */
    private mapSQLiteTypesToNotebookTypes(colType: number) {
        switch (colType) {
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