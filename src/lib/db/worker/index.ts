import iDB, { iDBname } from '$lib/indexeddb/schema';
import { type DexieError } from 'dexie';
import { DuckDB } from '../engines/duckdb';
import { PostgreSQL } from '../engines/pgsql';
import { SQLite } from '../engines/sqlite';
import type { DBStrategy } from '../engines/types';
import { DBEngine, type DBInfo, type DBWorkerMessages } from './types';
import { postError, postStatus, postSuccess } from './utils';

const DBS: Record<string, { db: DBStrategy, modifiedOn: string }> = {};


const getAvailableDBs = async (port: MessagePort) => {
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
    })
        .then(() => postSuccess(port, 'GET_AVAILABLE_DBS', { availableDBs: databaseInfo }))
        .catch((error: DexieError) => {
            const message = error.name === 'InvalidTableError' ? error.message : 'Failed to fetch Available DBs'
            console.error('message', error);
            postError(port, 'GET_AVAILABLE_DBS', {
                name: 'IDB_ERROR',
                message,
                cause: error.cause
            });
        })
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
    })
        .then(() => postSuccess(port, 'GET_ACTIVE_DBS', { activeDBs: databaseInfo }))
        .catch((error: DexieError) => {
            const message = error.name === 'InvalidTableError' ? error.message : 'Failed to fetch Active DBs'
            console.error('message', error);
            postError(port, 'GET_ACTIVE_DBS', {
                name: 'IDB_ERROR',
                message,
                cause: error.cause
            });
        })
}

const createDB = async (port: MessagePort, dbName: string, engine: DBEngine, persistent: boolean) => {
    if (!dbName || dbName.trim() === '') {
        postError(port, 'CREATE_DB', {
            name: 'INVALID_ARGS',
            message: 'Invalid Database Name',
            cause: 'Database Name cannot be blank.'
        });
        return;
    }

    if (/\d/.test(dbName[0])) {
        postError(port, 'CREATE_DB', {
            name: 'INVALID_ARGS',
            message: 'Invalid Database Name',
            cause: 'First character of Database Name must be an alphabet.'
        });
        return;
    }

    const alphanumericPattern = /^[a-zA-Z0-9]+$/;
    if (!alphanumericPattern.test(dbName)) {
        postError(port, 'CREATE_DB', {
            name: 'INVALID_ARGS',
            message: 'Invalid Database Name',
            cause: 'Database Name must be Alphanumeric.'
        });
        return;
    }

    if (dbName === iDBname) {
        postError(port, 'CREATE_DB', {
            name: 'INVALID_ARGS',
            message: 'Invalid Database Name',
            cause: 'Used by SQL Notebook.'
        });
        return;
    }

    const doesDBExist = await iDB.databases.get(dbName);

    if (doesDBExist) {
        postError(port, 'CREATE_DB', {
            name: 'DB_EXISTS',
            message: 'Duplicate Database',
            cause: `Database with name "${dbName}" already exists.`
        });
        return;
    }

    let db: DBStrategy;

    if (engine === DBEngine.PGSQL) {
        db = new PostgreSQL(dbName, { persistent });
    } else if (engine === DBEngine.SQLITE) {
        db = new SQLite(dbName, { persistent });
    } else if (engine === DBEngine.DUCKDB) {
        db = new DuckDB();
    } else {
        postError(port, 'CREATE_DB', {
            name: 'INVALID_ARGS',
            message: 'Unknown Database Engine',
            cause: `Supported Engines: ${DBEngine.PGSQL}, ${DBEngine.SQLITE}, ${DBEngine.DUCKDB}`
        });
        return;
    }

    try {
        await db.init();
    } catch (error) {
        postError(port, 'CREATE_DB', {
            name: 'DB_INIT',
            message: 'Unable to initialize database',
            cause: error
        })
        return;
    }

    const datetime = new Date().toLocaleString();

    await iDB.transaction('readwrite', iDB.databases, async () => {
        await iDB.databases.add({
            name: dbName,
            persistent,
            createdBy: 'user',
            createdOn: datetime,
            modifiedOn: datetime,
            engine,
            system: engine === 'pgsql' ? 'pglite' : engine === 'sqlite' ? 'wa-sqlite' : 'duckdb-wasm'
        });
    }).then(async () => {

        if (persistent) {
            await db.close();
        } else {
            DBS[dbName] = {
                db,
                modifiedOn: datetime
            }
        }

        postSuccess(port, 'CREATE_DB', { dbName: dbName });
    }).catch(async (error: DexieError) => {
        const message = error.name === 'InvalidTableError' ? error.message : 'Failed to create DB'
        console.error('message', error);
        postError(port, 'CREATE_DB', {
            name: 'IDB_ERROR',
            message,
            cause: error.cause
        });

        await db.close();

    }).finally(async () => {
        await getAvailableDBs(port);
        await getActiveDBs(port);
    })
}

const loadDB = async (port: MessagePort, dbName: string) => {

    if (dbName in DBS) {
        postError(port, 'LOAD_DB', {
            name: 'DB_IN_USE',
            message: 'Database In Use',
            cause: `Database with name ${dbName} is alredy in use`
        });
        return;
    }

    const config = await iDB.databases.get(dbName);

    if (!config) {
        postError(port, 'LOAD_DB', {
            name: 'DB_DNE',
            message: 'Database does not exist',
            cause: `Database with name "${dbName}" does not exist.`
        });
        return;
    }

    let db: DBStrategy;

    if (config.engine === DBEngine.PGSQL) {
        db = new PostgreSQL(dbName, { persistent: config.persistent });
    } else if (config.engine === DBEngine.SQLITE) {
        db = new SQLite(dbName, { persistent: config.persistent });
    } else if (config.engine === DBEngine.DUCKDB) {
        db = new DuckDB();
    } else {
        postError(port, 'LOAD_DB', {
            name: 'INVALID_DB',
            message: 'Unknown Database Engine',
            cause: `Supported Engines: ${DBEngine.PGSQL}, ${DBEngine.SQLITE}, ${DBEngine.DUCKDB}`
        });
        return;
    }

    try {
        await db.init();
    } catch (error) {
        postError(port, 'LOAD_DB', {
            name: 'DB_INIT',
            message: 'Unable to initialize database',
            cause: error
        })
        return;
    }

    DBS[dbName] = {
        db,
        modifiedOn: new Date().toLocaleString()
    }

    await getAvailableDBs(port);
    await getActiveDBs(port);
    postSuccess(port, 'LOAD_DB', { dbName });
}

const execQuery = async (port: MessagePort, id: string, dbName: string, query: string) => {
    if (!(dbName in DBS)) {
        postError(port, 'EXEC_QUERY', {
            id,
            name: 'DB_NOT_IN_USE',
            message: 'Database not In Use',
            cause: `Database with name "${dbName}" is not initialized.`
        });
        return;
    }

    const { db } = DBS[dbName];
    const results = {
        id,
        ...(await db.exec(query))
    };

    DBS[dbName].modifiedOn = new Date().toLocaleString();

    postSuccess(port, 'EXEC_QUERY', results);
}

const closeDB = async (port: MessagePort, dbName: string) => {
    if (!(dbName in DBS)) {
        postError(port, 'CLOSE_DB', {
            name: 'DB_NOT_IN_USE',
            message: 'Database not In Use',
            cause: `Database with name "${dbName}" is not initialized.`
        });
        return;
    }

    const { db, modifiedOn } = DBS[dbName];
    await iDB.transaction('readwrite', iDB.databases, async () => {
        await iDB.databases.update(dbName, { modifiedOn });
    }).catch(async (error: DexieError) => {
        const message = error.name === 'InvalidTableError' ? error.message : 'Failed to create DB'
        console.error('message', error);
        postError(port, 'CLOSE_DB', {
            name: 'IDB_ERROR',
            message,
            cause: error.cause
        });
    }).finally(async () => {
        await db.close()
        delete DBS[dbName];
        await getAvailableDBs(port);
        await getActiveDBs(port);
        postSuccess(port, 'CLOSE_DB', { dbName });
    })
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
                await getAvailableDBs(port);
                break;
            }
            case 'CREATE_DB': {
                const { dbName, engine, persistent } = data.args;
                await createDB(port, dbName, engine, persistent);
                break;
            }
            case 'LOAD_DB': {
                const { dbName } = data.args;
                await loadDB(port, dbName);
                break;
            }
            case 'EXEC_QUERY': {
                const { id, dbName, query } = data.args;
                await execQuery(port, id, dbName, query);
                break;
            }
            case 'CLOSE_DB': {
                const { dbName } = data.args;
                await closeDB(port, dbName);
                break;
            }
            case 'TERMINATE_DB': {
                const { dbName } = data.args;

                if (dbName in DBS) {
                    postError(port, 'TERMINATE_DB', {
                        name: 'DB_IN_USE',
                        message: 'Database In Use',
                        cause: `Database with name ${dbName} is alredy in use`
                    });
                    break;
                }

                const config = await iDB.databases.get(dbName);

                if (!config) {
                    postError(port, 'TERMINATE_DB', {
                        name: 'DB_DNE',
                        message: 'Database does not exist',
                        cause: `Database with name "${dbName}" does not exist.`
                    });
                    break;
                }

                if (config.engine === DBEngine.DUCKDB) {
                    await iDB.transaction('readwrite', iDB.databases, async () => {
                        await iDB.databases.delete(dbName);
                    }).then(async () => {
                        await getAvailableDBs(port);
                        postSuccess(port, 'TERMINATE_DB', { dbName });
                    })
                } else if (config.engine === DBEngine.PGSQL || config.engine === DBEngine.SQLITE) {
                    const iDBtoDelete = config.engine === DBEngine.PGSQL ? '/pglite/' + config.name : config.name;
                    const toDelete = indexedDB.deleteDatabase(iDBtoDelete);
                    toDelete.onsuccess = async () => {
                        await iDB.transaction('readwrite', iDB.databases, async () => {
                            await iDB.databases.delete(dbName);
                        }).then(async () => {
                            await getAvailableDBs(port);
                            postSuccess(port, 'TERMINATE_DB', { dbName });
                        })
                    }
                } else {
                    postError(port, 'TERMINATE_DB', {
                        name: 'INVALID_DB',
                        message: 'Unknown Database Engine',
                        cause: `Supported Engines: ${DBEngine.PGSQL}, ${DBEngine.SQLITE}, ${DBEngine.DUCKDB}`
                    });
                    break;
                }

            }
        }
    };

    port.onmessageerror = (error) => {
        console.error('Message error:', error);
    };
};

export { };
