import { PostgreSQL } from '../engines/pgsql';
import type { DBStrategy } from '../types';
import type { DBWorkerMessage } from './types';
import { getAvailableDBs, postError, postSuccess } from './utils';

const activeDBs: Record<string, DBStrategy> = {};
const availableDBs: Set<string> = new Set();

self.onconnect = async (event: MessageEvent) => {
    const port = event.ports[0];

    await getAvailableDBs();

    port.onmessage = async ({ data }: MessageEvent<DBWorkerMessage>) => {
        switch (data.command) {
            case 'GET_ACTIVE_DBS': {
                postSuccess(port, 'GET_ACTIVE_DBS', { activeDBs: Object.keys(activeDBs) });
                break;
            }
            case 'GET_AVAILABLE_DBS': {
                await getAvailableDBs();
                postSuccess(port, 'GET_AVAILABLE_DBS', { availableDBs: Array.from(availableDBs) });
                break;
            }
            case 'CREATE_DB': {
                const { dbName, engine, persistent } = data.args;

                if (availableDBs.has(dbName)) {
                    postError(port, 'CREATE_DB', `Database with name "${dbName}" already exists.`);
                    break;
                }

                if (engine === 'pgsql') {
                    const db = new PostgreSQL(dbName, { persistent });
                    await db.init();

                    if (persistent) await db.close().then(() => availableDBs.add(dbName));
                    else activeDBs[dbName] = db;

                    postSuccess(port, 'CREATE_DB', { dbName: dbName });
                }

                getAvailableDBs();
                postSuccess(port, 'GET_AVAILABLE_DBS', { availableDBs: Array.from(availableDBs) });
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
                postSuccess(port, 'EXEC_QUERY', { results });
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
