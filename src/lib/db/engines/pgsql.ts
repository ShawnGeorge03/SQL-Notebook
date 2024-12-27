import { IdbFs, MemoryFS, PGlite, types, type PGliteOptions, type Results, type Transaction } from '@electric-sql/pglite';
import { format, type FormatOptionsWithLanguage } from 'sql-formatter';
import { DBEngine } from '../worker/types';
import { NotebookType, type DBOptions, type DBStrategy, type QueryResult } from './types';
import getSQLFormatConfig from './utils';

/** Class representing a PostgreSQL Database.
 *
 * @class
 * @implements {DBStrategy}
 */
export class PostgreSQL implements DBStrategy {
	#db!: PGlite;
	#dbName: string;
	#dbOptions: PGliteOptions;

	#sqlFormatConfig: FormatOptionsWithLanguage;

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

		this.#sqlFormatConfig = getSQLFormatConfig(DBEngine.PGSQL);
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

		const statements = format(query, this.#sqlFormatConfig).split(';')

		const data: QueryResult[] = [];

		await this.#db.transaction(async (tx: Transaction) => {
			for (const statement of statements) {
				if (statement.length === 0) continue;

				await tx.query(statement)
					.then((result) => {
						if (result.fields.length === 0) return;
						data.push({
							rows: result.rows,
							cols: this.#columnToTypes(result.fields),
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
	 * Maps the data type IDs returned from the database to the corresponding NotebookType.
	 * This function is used to determine the data type of each column in the query results.
	 *
	 * @param fields - The fields returned from the database query.
	 * @returns The column definitions with the appropriate data types.
	 */
	#columnToTypes(fields: Results['fields']): QueryResult['cols'] {
		const cols = [];

		for (const { name, dataTypeID } of fields) {
			switch (dataTypeID) {
				case types.BOOL:
					cols.push({ name, type: NotebookType.BOOLEAN })
					break;
				case types.INT2:
				case types.INT4:
				case types.INT8:
				case types.FLOAT4:
				case types.FLOAT8:
				case types.MONEY:
				case types.NUMERIC:
					cols.push({ name, type: NotebookType.NUMBER })
					break;
				case types.DATE:
					cols.push({ name, type: NotebookType.DATE })
					break;
				case types.TIME:
				case types.TIMETZ:
					cols.push({ name, type: NotebookType.TIME })
					break;
				case types.ABSTIME:
				case types.TIMESTAMP:
				case types.TIMESTAMPTZ:
					cols.push({ name, type: NotebookType.DATETIME })
					break;
				case types.TEXT:
				case types.CHAR:
				case types.VARCHAR:
				case types.BPCHAR:
				case types.RELTIME:
				case types.INTERVAL:
				case types.UUID:
					cols.push({ name, type: NotebookType.STRING })
					break;
				default:
					cols.push({ name, type: NotebookType.STRING })
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
