import { IdbFs, MemoryFS, PGlite, type PGliteOptions, type Transaction } from '@electric-sql/pglite';
import { format, type FormatOptionsWithLanguage } from 'sql-formatter';
import { DBEngine } from '../worker/types';
import type { DBOptions, DBStrategy } from './types';
import getSQLFormatConfig from './utils';

/** Class representing a PostgreSQL Database.
 *
 * @class
 * @implements {DBStrategy}
 */
export class PostgreSQL implements DBStrategy {
	db!: PGlite;
	dbName: string;
	dbOptions: PGliteOptions;

	sqlFormatConfig: FormatOptionsWithLanguage;

	/**
	 * Creates a PostgreSQL object.
	 *
	 * @param {string} dbName - The name of the database.
	 * @param {DBOptions} dbOptions - The options for the database.
	 */
	constructor(dbName: string, dbOptions: DBOptions) {
		this.dbName = dbName;
		this.dbOptions = {
			fs: dbOptions.persistent ? new IdbFs(this.dbName) : new MemoryFS()
		};

		this.sqlFormatConfig = getSQLFormatConfig(DBEngine.PGSQL);
	}

	/**
	 * Initializes a PostgreSQL Database.
	 *
	 * @throws {Error} Will throw an Error if the database cannot be initialized.
	 */
	async init(): Promise<void> {
		try {
			this.db = await PGlite.create(this.dbOptions);
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
	 * Return the results from a query.
	 *
	 * All queries will be run within a transaction to
	 * ensure failed queries do not cause issues to the
	 * database.
	 *
	 * @param {string} query - The query to be run.
	 *
	 * @returns {Promise{unknown[]}} - Promise Object reprsenting the query results.
	 */
	async exec(query: string): Promise<unknown[]> {
		if (!this.db)
			throw new Error('Database not initialized');

		const statements = format(query, this.sqlFormatConfig).split(';')

		const data: unknown[] = [];

		await this.db.transaction(async (tx: Transaction) => {
			for (const statement of statements) {
				if (statement.length === 0) continue;

				await tx.query(statement)
					.then((result) => {
						data.push({
							rows: result.rows,
							cols: result.fields,
						})
					})
					.catch(async (error) => {
						const cause = statement.trim();
						await tx.rollback();

						if (error instanceof Error) {
							if (error.cause) {
								throw new Error(error.message + ' (' + error.cause + ')', { cause });
							} else {
								throw new Error(error.message, { cause });
							}
						} else {
							throw new Error(`Database query failed: ${String(error)}`, { cause });
						}
					})
			}
		})

		return data;
	}

	/**
	 * Closes the Database.
	 */
	async close(): Promise<void> {
		await this.db.close();
	}
}
