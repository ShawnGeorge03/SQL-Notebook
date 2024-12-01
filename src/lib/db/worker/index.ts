import { PostgreSQL } from '../engines/pgsql';
import type { DBStrategy } from '../engines/types';
import type { DBWorkerMessages } from './types';
import { postError, postStatus, postSuccess } from './utils';

const activeDBs: Record<string, DBStrategy> = {};
const availableDBs: Set<string> = new Set();

const updateAvailableDBs = async (port: MessagePort) => {
    try {
        availableDBs.clear();
        const databases = await indexedDB.databases()
        for (const db of databases) {
            if (db.name) {
                const dbName = db.name.startsWith('/pglite/') ? db.name.slice(8) : db.name;
                availableDBs.add(dbName);
            }
        }

        postSuccess(port, 'GET_AVAILABLE_DBS', { availableDBs: Array.from(availableDBs) });
    } catch (error) {
        console.error('Failed to fetch Available DBs:', error);
        postError(port, 'GET_AVAILABLE_DBS', "Failed to fetch Available DBs");
    }
}

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

                await updateAvailableDBs(port);

                if (availableDBs.has(dbName)) {
                    postError(port, 'CREATE_DB', `Database with name "${dbName}" already exists.`);
                    break;
                }

                if (engine === 'pgsql') {
                    const db = new PostgreSQL(dbName, { persistent });
                    await db.init();

                    if (persistent) {
                        await db.close().then(() => availableDBs.add(dbName));
                        await updateAvailableDBs(port);
                    } else {
                        activeDBs[dbName] = db;
                        postSuccess(port, 'GET_ACTIVE_DBS', { activeDBs: Object.keys(activeDBs) });
                    }

                    postSuccess(port, 'CREATE_DB', { dbName: dbName });
                }

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
