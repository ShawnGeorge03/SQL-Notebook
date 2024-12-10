import iDB, { iDBname } from '$lib/indexeddb/schema';
import { PostgreSQL } from '../engines/pgsql';
import type { DBStrategy } from '../engines/types';
import type { DBInfo, DBWorkerMessages } from './types';
import { postError, postStatus, postSuccess } from './utils';

const DBS: Record<string, DBStrategy> = {};

const updateAvailableDBs = async (port: MessagePort) => {
    try {
        const databaseInfo: DBInfo[] = [];

        await iDB.transaction('r', iDB.databases, async () => {
            await iDB.databases.each((database) => {
                if (!Object.keys(DBS).includes(database.name)) {
                    databaseInfo.push({
                        name: database.name,
                        engine: database.engine,
                        persistent: database.persistent
                    });
                }
            })
        });

        // Post success response with the list of available databases
        postSuccess(port, 'GET_AVAILABLE_DBS', { availableDBs: databaseInfo });
    } catch (error) {
        console.error('Failed to fetch Available DBs:', error);
        postError(port, 'GET_AVAILABLE_DBS', {
            message: 'Failed to fetch Available DBs'
        });
    }
};

const getActiveDBs = async (port: MessagePort) => {
    const databaseInfo: DBInfo[] = [];
    await iDB.transaction('r', iDB.databases, async () => {
        const databases = await iDB.databases.bulkGet(Object.keys(DBS));
        databases.forEach((database) => {
            if (database)
                databaseInfo.push({
                    name: database.name,
                    engine: database.engine,
                    persistent: database.persistent
                });
        });
    });

    postSuccess(port, 'GET_ACTIVE_DBS', { activeDBs: databaseInfo });
}

self.onconnect = async (event: MessageEvent) => {
    const port = event.ports[0];

    postStatus(port, 'INITIALIZED');

    port.onmessage = async ({ data }: MessageEvent<DBWorkerMessages>) => {
        switch (data.command) {
            case 'GET_ACTIVE_DBS': {
                await getActiveDBs(port);
                break;
            }
            case 'GET_AVAILABLE_DBS': {
                await updateAvailableDBs(port);
                break;
            }
            case 'CREATE_DB': {
                const { dbName, engine, persistent } = data.args;

                if (dbName === iDBname) {
                    postError(port, 'CREATE_DB', {
                        message: `Datebase with name "${dbName}" is not allowed.`,
                        cause: 'Used by SQL Note.'
                    });
                    break;
                }

                await updateAvailableDBs(port);

                const doesDBExist = await iDB.databases.get(dbName);

                if (doesDBExist) {
                    postError(port, 'CREATE_DB', {
                        message: `Database with name "${dbName}" already exists.`
                    });
                    break;
                }

                let db: DBStrategy;

                if (engine === 'pgsql') {
                    db = new PostgreSQL(dbName, { persistent });
                } else {
                    postError(port, 'CREATE_DB', {
                        message: `Unknown Database Engine: ${engine}`
                    });
                    break;
                }

                await db.init();

                await iDB.databases.add({
                    name: dbName,
                    persistent,
                    createdBy: 'user',
                    createdOn: new Date().toLocaleString(),
                    modifiedOn: new Date().toLocaleString(),
                    engine,
                    system: engine === 'pgsql' ? 'pglite' : engine === 'sqlite' ? 'wa-sqlite' : 'duckdb-wasm'
                });

                if (persistent) {
                    await db.close();
                    await updateAvailableDBs(port);
                } else {
                    DBS[dbName] = db;
                    await getActiveDBs(port);
                }

                postSuccess(port, 'CREATE_DB', { dbName: dbName });
                break;
            }
            case 'LOAD_DB': {
                const { dbName } = data.args;

                if (dbName in DBS) {
                    postError(port, 'LOAD_DB', {
                        message: `Database "${dbName}" is already in use.`
                    });
                    break;
                }

                await updateAvailableDBs(port);
                const config = await iDB.databases.get(dbName);

                if (!config) {
                    postError(port, 'LOAD_DB', {
                        message: `Database with name "${dbName}" does not exist.`
                    });
                    break;
                }

                let db: DBStrategy;

                if (config.engine === 'pgsql') {
                    db = new PostgreSQL(dbName, { persistent: config.persistent });
                } else {
                    postError(port, 'LOAD_DB', {
                        message: `Unknown Database Engine: ${config.engine}`
                    });
                    break;
                }

                await db.init().then(async () => DBS[dbName] = db);

                await getActiveDBs(port);

                await updateAvailableDBs(port);

                postSuccess(port, 'LOAD_DB', { dbName });

                await iDB.databases.update(dbName, { modifiedOn: new Date().toLocaleString() });

                break;
            }
            case 'EXEC_QUERY': {
                const { id, dbName, query } = data.args;

                if (!(dbName in DBS)) {
                    postError(port, 'EXEC_QUERY', {
                        id,
                        message: `Database with name "${dbName}" is not initialized.`
                    });
                    break;
                }

                const db = DBS[dbName];
                const results = {
                    id,
                    ...(await db.exec(query))
                };

                postSuccess(port, 'EXEC_QUERY', results);
                break;
            }
            case 'CLOSE_DB': {
                const { dbName } = data.args;

                if (!(dbName in DBS)) {
                    postError(port, 'CLOSE_DB', {
                        message: `Database with name "${dbName}" is not initialized.`
                    });
                    break;
                }

                const db = DBS[dbName];
                await db.close().then(() => {
                    delete DBS[dbName];
                    postSuccess(port, 'CLOSE_DB', { dbName });
                });

                await getActiveDBs(port);
                await updateAvailableDBs(port);
                break;
            }
            case 'TERMINATE_DB': {
                const { dbName } = data.args;

                if (dbName in DBS) {
                    postError(port, 'TERMINATE_DB', {
                        message: `Database with name "${dbName}" is currently running.`
                    });
                    break;
                }

                const config = await iDB.databases.get(dbName);

                if (!config) {
                    postError(port, 'TERMINATE_DB', {
                        message: `Database with name "${dbName}" does not exist.`
                    });
                    break;
                }

                if (!config.persistent) {
                    postError(port, 'TERMINATE_DB', {
                        message: `Database with name "${dbName}" is not persistent.`
                    });
                    break;
                }

                let iDbName = ""

                if (config.system === 'pglite') {
                    iDbName = '/pglite/' + config.name;
                } else {
                    postError(port, 'TERMINATE_DB', {
                        message: `Unknown Database System: ${config.system}`
                    });
                    break;
                }

                const toDelete = indexedDB.deleteDatabase(iDbName);

                toDelete.onsuccess = async () => {

                    await iDB.transaction('readwrite', iDB.databases, async () => {
                        await iDB.databases.delete(dbName);
                    })

                    await updateAvailableDBs(port);
                    postSuccess(port, 'TERMINATE_DB', { dbName });
                }


            }
        }
    };

    port.onmessageerror = (error) => {
        console.error('Message error:', error);
    };
};

export { };
