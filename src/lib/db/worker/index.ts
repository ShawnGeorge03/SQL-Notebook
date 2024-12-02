import { iDbName, sqlNoteDB } from '$lib/data/schema';
import { PostgreSQL } from '../engines/pgsql';
import type { DBStrategy } from '../engines/types';
import type { DBWorkerMessages } from './types';
import { postError, postStatus, postSuccess } from './utils';

const activeDBs: Record<string, DBStrategy> = {};
const availableDBs: Set<string> = new Set();

const updateAvailableDBs = async (port: MessagePort) => {
    try {
        availableDBs.clear();

        const databases = await indexedDB.databases();
        databases.forEach(db => {
            if (db.name) {
                const dbName = db.name.startsWith('/pglite/') ? db.name.slice(8) : db.name;
                availableDBs.add(dbName);
            }
        });

        await sqlNoteDB.transaction('r', sqlNoteDB.databases, async () => {
            const inMemoryDBs = await sqlNoteDB.databases
                .filter(database => !database.persistent)
                .toArray();
            inMemoryDBs.forEach(database => availableDBs.add(database.name));
        });

        for (const dbName of Object.keys(activeDBs)) availableDBs.delete(dbName);
        availableDBs.delete(iDbName);

        await sqlNoteDB.transaction('rw', sqlNoteDB.databases, async () => {
            const staleDBs = await sqlNoteDB.databases
                .filter(database => !availableDBs.has(database.name));
            staleDBs.delete();
        });

        // Post success response with the list of available databases
        postSuccess(port, 'GET_AVAILABLE_DBS', { availableDBs: Array.from(availableDBs) });
    } catch (error) {
        console.error('Failed to fetch Available DBs:', error);
        postError(port, 'GET_AVAILABLE_DBS', "Failed to fetch Available DBs");
    }
};

self.onconnect = async (event: MessageEvent) => {
    const port = event.ports[0];

    postStatus(port, "INITIALIZED");

    port.onmessage = async ({ data }: MessageEvent<DBWorkerMessages>) => {
        switch (data.command) {
            case 'GET_ACTIVE_DBS': {
                postSuccess(port, 'GET_ACTIVE_DBS', { activeDBs: Object.keys(activeDBs) });
                break;
            }
            case 'GET_AVAILABLE_DBS': {
                await updateAvailableDBs(port);
                break;
            }
            case 'CREATE_DB': {
                const { dbName, engine, persistent } = data.args;

                if (dbName === iDbName) {
                    postError(port, "CREATE_DB", `Datebase with name "${dbName}" is not allowed.`, "Used by SQL Note.");
                    break;
                }

                await updateAvailableDBs(port);

                if (availableDBs.has(dbName)) {
                    postError(port, 'CREATE_DB', `Database with name "${dbName}" already exists.`);
                    break;
                }

                let db: DBStrategy;

                if (engine === 'pgsql') {
                    db = new PostgreSQL(dbName, { persistent });
                } else {
                    postError(port, 'CREATE_DB', `Unknown Database Engine: ${engine}`)
                    break;
                }

                await db.init();

                await sqlNoteDB.databases.add({
                    name: dbName,
                    persistent,
                    createdOn: new Date().toLocaleString(),
                    lastUsedOn: new Date().toLocaleString(),
                    engine,
                    system: engine === 'pgsql' ? 'pglite' : engine === 'sqlite' ? 'wa-sqlite' : 'duckdb-wasm',
                });

                if (persistent) {
                    await db.close();
                    await updateAvailableDBs(port);
                } else {
                    activeDBs[dbName] = db;
                    postSuccess(port, 'GET_ACTIVE_DBS', { activeDBs: Object.keys(activeDBs) });
                }

                postSuccess(port, 'CREATE_DB', { dbName: dbName });
                break;
            }
            case 'LOAD_DB': {
                const { dbName, engine, persistent } = data.args;

                if (!persistent) {
                    postError(
                        port,
                        'LOAD_DB',
                        `Database with name "${dbName}" should be initialized with createDB`
                    );
                    break;
                }

                if (dbName in activeDBs) {
                    postError(port, 'LOAD_DB', `Database with name "${dbName}" is already in use.`);
                    break;
                }

                if (engine === 'pgsql') {
                    const db = new PostgreSQL(dbName, { persistent: persistent });
                    await db.init().then(() => {
                        activeDBs[dbName] = db;
                        postSuccess(port, 'LOAD_DB', { dbName });
                        postSuccess(port, 'GET_ACTIVE_DBS', { activeDBs: Object.keys(activeDBs) });
                    });
                }

                break;
            }
            case 'EXEC_QUERY': {
                const { dbName, query } = data.args;

                if (!(dbName in activeDBs)) {
                    postError(port, 'EXEC_QUERY', `Database with name "${dbName}" is not initialized.`);
                    break;
                }

                const db = activeDBs[dbName];
                const results = await db.exec(query);
                postSuccess(port, 'EXEC_QUERY', results);
                break;
            }
            case 'CLOSE_DB': {
                const { dbName } = data.args;

                if (!(dbName in activeDBs)) {
                    postError(port, 'CLOSE_DB', `Database with name "${dbName}" is not initialized.`);
                    break;
                }

                const db = activeDBs[dbName];
                await db.close().then(() => {
                    delete activeDBs[dbName];
                    postSuccess(port, 'CLOSE_DB', { dbName });
                    postSuccess(port, 'GET_ACTIVE_DBS', { activeDBs: Object.keys(activeDBs) });
                });
                break;
            }
        }
    };

    port.onmessageerror = (error) => {
        console.error('Message error:', error);
    };
};

export { };
