import {
    AsyncDuckDB,
    type AsyncDuckDBConnection,
    ConsoleLogger,
    getJsDelivrBundles,
    LogLevel,
    selectBundle
} from '@duckdb/duckdb-wasm';

import type { DBStrategy, QueryResult } from './types';

/** Class representing a DuckDB Database.
 *
 * @class
 * @implements {DBStrategy}
 */
export class DuckDB implements DBStrategy {
    #db!: AsyncDuckDB;
    #conn!: AsyncDuckDBConnection;

    /**
     * Initializes a DuckDB Database.
     *
     * @throws {Error} Will throw an Error if the database cannot be initialized.
     */
    async init(): Promise<void> {
        try {
            // Select a bundle based on browser checks
            const JSDELIVR_BUNDLES = getJsDelivrBundles();
            const bundle = await selectBundle(JSDELIVR_BUNDLES);

            const worker_url = URL.createObjectURL(
                new Blob([`importScripts("${bundle.mainWorker}");`], {
                    type: 'text/javascript'
                })
            );

            // Instantiate the asynchronus version of DuckDB
            const worker = new Worker(worker_url);
            const logger = new ConsoleLogger(LogLevel.ERROR);
            this.#db = new AsyncDuckDB(logger, worker);
            URL.revokeObjectURL(worker_url);
            await this.#db.instantiate(bundle.mainModule, bundle.pthreadWorker);

            await this.#db.open({
                filesystem: { allowFullHTTPReads: true },
                query: { castBigIntToDouble: true }
            });

            this.#connect();
        } catch (error) {
            console.log(error);
            const initError =
                error instanceof Error
                    ? error
                    : new Error(`Database initialization failed: ${String(error)}`);

            throw initError;
        }
    }

    /**
     * Creates a database connection
     */
    async #connect() {
        if (!this.#db) throw new Error('Database not initialized');

        this.#conn = await this.#db.connect();

        // Loads the icu extension (https://duckdb.org/docs/extensions/icu.html)
        await this.#conn.query('LOAD icu;');
        await this.#conn.query('SET errors_as_json = true;');
    }

    exec(query: string): Promise<QueryResult> {
        throw new Error('Method not implemented.');
    }
    close(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
