import { IdbFs, MemoryFS, PGlite, type PGliteOptions } from '@electric-sql/pglite';
import type { DBEngineOptions, DBStrategy, QueryResult } from './types';

export class PostgreSQL implements DBStrategy {
	db!: PGlite;
	dbName: string;
	dbOptions: PGliteOptions;

	constructor(dbName: string, dbOptions: DBEngineOptions) {
		this.dbName = dbName;
		this.dbOptions = {
			fs: dbOptions.persistent ? new IdbFs(this.dbName) : new MemoryFS()
		};
	}

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

	async exec(query: string): Promise<QueryResult> {
		try {
			if (!this.db) throw new Error('Database not initialized');

			const startTime = performance.now();
			let data;

			await this.db.transaction(async (tx) => {
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

	async close(): Promise<void> {
		await this.db.close();
	}
}
