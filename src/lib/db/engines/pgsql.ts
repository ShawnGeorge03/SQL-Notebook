import type { PGliteOptions, Results, Transaction } from '@electric-sql/pglite';
// Ensure that all non type imports are from a CDN else the final bundle will include the PostgreSQL WASM file.
import {
	IdbFs,
	MemoryFS,
	PGlite,
	types,
} from
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	'https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.2.15/dist/index.min.js';

import { NotebookType, type DBOptions, type DBStrategy, type QueryResult } from './types';
import { isValidQuery } from './utils';

/** Class representing a PostgreSQL Database.
 *
 * @class
 * @implements {DBStrategy}
 */
export class PostgreSQL implements DBStrategy {
	#db!: PGlite;
	#dbName: string;
	#dbOptions: PGliteOptions;

	KEYWORDS = /\b(SELECT|INSERT|UPDATE|DELETE|TRUNCATE|CREATE|ALTER|DROP|WITH|DO|BEGIN|END|DECLARE|EXECUTE|EXPLAIN|VACUUM|ANALYZE|GRANT|REVOKE)\b/gi;
	/**
	 * Creates a PostgreSQL object.
	 *
	 * @param {string} dbName - The name of the database.
	 * @param {DBOptions} dbOptions - The options for the database.
	 */
	constructor(dbName: string, dbOptions: DBOptions) {
		this.#dbName = dbName;
		this.#dbOptions = {
			fs: dbOptions.persistent ? new IdbFs(this.#dbName) : new MemoryFS()
		};
	}

	/**
	 * Initializes a PostgreSQL Database.
	 *
	 * @throws {Error} Will throw an Error if the database cannot be initialized.
	 */
	async init(): Promise<void> {
		try {
			this.#db = await PGlite.create(this.#dbOptions);
		} catch (error) {
			const initError =
				error instanceof Error
					? error
					: new Error(`Database initialization failed: ${String(error)}`);

			console.error('Database initialization error:', initError);

			throw initError;
		}
	}

	/**
	 * Executes a SQL query within a transaction, ensuring
	 * failed queries do not cause issues to the database.
	 *
	 * @param {string} query - The SQL query to be executed.
	 *
	 * @returns {Promise<QueryResult>} - A Promise that resolves to an array of
	 * 	`QueryResult` objects representing the results of the executed query.
	 *
	 * @throws {Error} Will throw an Error if the database is not initialized.
	 * @throws {Error} Will throw an Error if the query execution fails.
	 *
	 */
	async exec(query: string): Promise<QueryResult> {
		if (!this.#db) {
			throw new Error('Database not initialized');
		}

		isValidQuery(query, this.KEYWORDS)

		return this.#db.transaction(async (tx: Transaction) => {
			try {
				const result = await tx.query(query);

				return {
					rows: result.rows.map((row) => Object.values(row as Record<string, unknown>)),
					cols: this.mapPostgresTypesToNotebookTypes(result.fields)
				};
			} catch (error) {
				await tx.rollback();
				if (error instanceof Error)
					throw new Error(error.cause ? `${error.message} (${error.cause})` : error.message, {
						cause: query
					});

				throw new Error(`Database query failed: ${String(error)}`, { cause: query });
			}
		});
	}
	/**
	 * Maps PostgreSQL column types to Notebook types.
	 *
	 * @param {Results['fields']} fields - The array of PostgreSQL fields to be mapped.
	 * @returns {QueryResult['cols']} The array of columns with mapped Notebook types.
	 */
	private mapPostgresTypesToNotebookTypes(fields: Results['fields']): QueryResult['cols'] {
		const cols = [];

		for (const { name, dataTypeID } of fields) {
			switch (dataTypeID) {
				case types.BOOL:
					cols.push({ name, type: NotebookType.BOOLEAN });
					break;
				case types.INT2:
				case types.INT4:
				case types.INT8:
				case types.FLOAT4:
				case types.FLOAT8:
				case types.MONEY:
				case types.NUMERIC:
					cols.push({ name, type: NotebookType.NUMBER });
					break;
				case types.DATE:
					cols.push({ name, type: NotebookType.DATE });
					break;
				case types.TIME:
				case types.TIMETZ:
					cols.push({ name, type: NotebookType.TIME });
					break;
				case types.ABSTIME:
				case types.TIMESTAMP:
				case types.TIMESTAMPTZ:
					cols.push({ name, type: NotebookType.DATETIME });
					break;
				case types.TEXT:
				case types.CHAR:
				case types.VARCHAR:
				case types.BPCHAR:
				case types.RELTIME:
				case types.INTERVAL:
				case types.UUID:
					cols.push({ name, type: NotebookType.STRING });
					break;
				default:
					cols.push({ name, type: NotebookType.STRING });
					break;
			}
		}

		return cols;
	}

	/**
	 * Closes the Database.
	 */
	async close(): Promise<void> {
		await this.#db.close();
	}
}
