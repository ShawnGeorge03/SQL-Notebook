import { IdbFs, MemoryFS, PGlite, type PGliteOptions } from '@electric-sql/pglite';
import type { DBOptions, DBStrategy, QueryResult } from './types';

/** Class representing a PostgreSQL Database.
 *
 * @class
 * @implements {DBStrategy}
 */
export class PostgreSQL implements DBStrategy {
	#db!: PGlite;
	#dbOptions: PGliteOptions;
	#dbName: string;

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
			let data;

			await this.#db.transaction(async (tx) => {
				data = await tx.exec(query);
			});

			return {
				data,
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
		await this.#db.close();
	}
}
