import iDB, { iDBname } from '$lib/indexeddb/schema';
import { type DexieError } from 'dexie';
import { nanoid } from 'nanoid/non-secure';
import { DuckDB } from '../engines/duckdb';
import { PostgreSQL } from '../engines/pgsql';
import { SQLite } from '../engines/sqlite';
import type { DBStrategy } from '../engines/types';
import { DBEngine, type DBInfo, type DBWorkerMessages, type ErrorResponseData, type SuccessResponseData } from './types';
import { broadcastResponse, postError, postResponse, postStatus, postSuccess } from './utils';

const DBS: Record<string, { db: DBStrategy, modifiedOn: string }> = {};
const ports: MessagePort[] = [];

const getAvailableDBs = async () => {
    const availableDBs: DBInfo[] = [];

    return await iDB.transaction('r', iDB.databases, async () => {
        await iDB.databases.each((database) => {
            if (!Object.keys(DBS).includes(database.name)) {
                availableDBs.push({
                    name: database.name,
                    engine: database.engine,
                    persistent: database.persistent
                });
            }
        })
    })
        .then(() => broadcastResponse(ports, 'GET_AVAILABLE_DBS', { availableDBs }))
        .catch((error: DexieError) => {
            const message = error.name === 'InvalidTableError' ? error.message : 'Failed to fetch Available DBs'
            console.error('message', error);
            broadcastResponse(ports, 'GET_AVAILABLE_DBS', {
                name: 'IDB_ERROR',
                message,
                cause: error.cause
            });
        })
};

const getActiveDBs = async () => {
    const activeDBs: DBInfo[] = [];
    await iDB.transaction('r', iDB.databases, async () => {
        const databases = await iDB.databases.bulkGet(Object.keys(DBS));
        databases.forEach((database) => {
            if (database)
                activeDBs.push({
                    name: database.name,
                    engine: database.engine,
                    persistent: database.persistent
                });
        });
    })
        .then(() => broadcastResponse(ports, 'GET_ACTIVE_DBS', { activeDBs }))
        .catch((error: DexieError) => {
            const message = error.name === 'InvalidTableError' ? error.message : 'Failed to fetch Active DBs'
            console.error('message', error);
            broadcastResponse(ports, 'GET_ACTIVE_DBS', {
                name: 'IDB_ERROR',
                message,
                cause: error.cause
            });
        })
}

const createDB = async (port: MessagePort, dbName: string, engine: DBEngine, persistent: boolean): Promise<SuccessResponseData['CREATE_DB'] | ErrorResponseData['CREATE_DB']> => {
    if (!dbName || dbName.trim() === '')
        return {
            name: 'INVALID_ARGS',
            message: 'Invalid Database Name',
            cause: 'Database Name cannot be blank.'
        }

    if (/\d/.test(dbName[0]))
        return {
            name: 'INVALID_ARGS',
            message: 'Invalid Database Name',
            cause: 'First character of Database Name must be an alphabet.'
        }

    const alphanumericPattern = /^[a-zA-Z0-9-_]+$/;
    if (!alphanumericPattern.test(dbName))
        return {
            name: 'INVALID_ARGS',
            message: 'Invalid Database Name',
            cause: 'Database Name must be Alphanumeric.'
        };

    if (dbName === iDBname) {
        return {
            name: 'INVALID_ARGS',
            message: 'Invalid Database Name',
            cause: 'Used by SQL Notebook.'
        };
    }

    const doesDBExist = await iDB.databases.get(dbName);

    if (doesDBExist)
        return {
            name: 'DB_EXISTS',
            message: 'Duplicate Database',
            cause: `Database with name "${dbName}" already exists.`
        };

    let db: DBStrategy;

    if (engine === DBEngine.PGSQL) {
        db = new PostgreSQL(dbName, { persistent });
    } else if (engine === DBEngine.SQLITE) {
        db = new SQLite(dbName, { persistent });
    } else if (engine === DBEngine.DUCKDB) {
        db = new DuckDB();
    } else {
        return {
            name: 'INVALID_ARGS',
            message: 'Unknown Database Engine',
            cause: `Supported Engines: ${DBEngine.PGSQL}, ${DBEngine.SQLITE}, ${DBEngine.DUCKDB}`
        };
    }

    try {
        await db.init();
    } catch (error) {
        return {
            name: 'DB_INIT',
            message: 'Unable to initialize database',
            cause: error
        };
    }

    const curr = new Date().toLocaleString();

    return await iDB.transaction('readwrite', iDB.databases, async () => {
        await iDB.databases.add({
            name: dbName,
            persistent,
            createdBy: 'user',
            createdOn: curr,
            modifiedOn: curr,
            engine,
            system: engine === 'pgsql' ? 'pglite' : engine === 'sqlite' ? 'wa-sqlite' : 'duckdb-wasm'
        });
    }).then(async () => {

        if (persistent) {
            await db.close();
        } else {
            DBS[dbName] = {
                db,
                modifiedOn: curr
            }
        }

        return { dbName };
    }).catch(async (error: DexieError) => {
        const message = error.name === 'InvalidTableError' ? error.message : 'Failed to create DB'
        console.error('message', error);
        await db.close();

        return {
            name: 'IDB_ERROR',
            message,
            cause: error.cause
        };
    }).finally(async () => {
        await getAvailableDBs();
        await getActiveDBs();
    })
}

const loadDB = async (port: MessagePort, dbName: string): Promise<SuccessResponseData['LOAD_DB'] | ErrorResponseData['LOAD_DB']> => {

    if (dbName in DBS)
        return {
            name: 'DB_IN_USE',
            message: 'Database In Use',
            cause: `Database with name ${dbName} is alredy in use`
        };

    const config = await iDB.databases.get(dbName);

    if (!config)
        return {
            name: 'DB_DNE',
            message: 'Database does not exist',
            cause: `Database with name "${dbName}" does not exist.`
        };

    let db: DBStrategy;

    if (config.engine === DBEngine.PGSQL) {
        db = new PostgreSQL(dbName, { persistent: config.persistent });
    } else if (config.engine === DBEngine.SQLITE) {
        db = new SQLite(dbName, { persistent: config.persistent });
    } else if (config.engine === DBEngine.DUCKDB) {
        db = new DuckDB();
    } else {
        return {
            name: 'INVALID_DB',
            message: 'Unknown Database Engine',
            cause: `Supported Engines: ${DBEngine.PGSQL}, ${DBEngine.SQLITE}, ${DBEngine.DUCKDB}`
        };
    }

    try {
        await db.init();
    } catch (error) {
        return {
            name: 'DB_INIT',
            message: 'Unable to initialize database',
            cause: error
        };
    }

    DBS[dbName] = {
        db,
        modifiedOn: new Date().toLocaleString()
    }

    await getAvailableDBs();
    await getActiveDBs();
    return { dbName };
}

const execQuery = async (port: MessagePort, id: string, dbName: string, query: string): Promise<SuccessResponseData['EXEC_QUERY'] | ErrorResponseData['EXEC_QUERY']> => {
    if (!(dbName in DBS))
        return {
            id,
            name: 'DB_NOT_IN_USE',
            message: 'Database not In Use',
            cause: `Database with name "${dbName}" is not initialized.`
        };

    const { db } = DBS[dbName];
    const results = {
        id,
        ...(await db.exec(query))
    };

    DBS[dbName].modifiedOn = new Date().toLocaleString();

    return results;
}

const closeDB = async (port: MessagePort, dbName: string): Promise<SuccessResponseData['CLOSE_DB'] | ErrorResponseData['CLOSE_DB']> => {
    if (!(dbName in DBS))
        return {
            name: 'DB_NOT_IN_USE',
            message: 'Database not In Use',
            cause: `Database with name "${dbName}" is not initialized.`
        };

    const { db, modifiedOn } = DBS[dbName];
    return await iDB.transaction('readwrite', iDB.databases, async () => {
        await iDB.databases.update(dbName, { modifiedOn });
    })
        .then(() => { return { dbName }; })
        .catch(async (error: DexieError) => {
            const message = error.name === 'InvalidTableError' ? error.message : 'Failed to create DB'
            console.error('message', error);
            return {
                name: 'IDB_ERROR',
                message,
                cause: error.cause
            };
        }).finally(async () => {
            await db.close()
            delete DBS[dbName];
            await getAvailableDBs();
            await getActiveDBs();
        })
}

self.onconnect = async (event: MessageEvent) => {
    const port = event.ports[0];

    ports.push(port);

    postStatus(port, 'INITIALIZED');

    port.onmessage = async ({ data }: MessageEvent<DBWorkerMessages>) => {
        switch (data.command) {
            case 'GET_ACTIVE_DBS': {
                await getActiveDBs();
                break;
            }
            case 'GET_AVAILABLE_DBS': {
                await getAvailableDBs();
                break;
            }
            case 'CREATE_DB': {
                const { dbName, engine, persistent } = data.args;
                const response = await createDB(port, dbName, engine, persistent);
                postResponse(port, 'CREATE_DB', response);
                break;
            }
            case 'LOAD_DB': {
                const { dbName } = data.args;
                const response = await loadDB(port, dbName);
                postResponse(port, 'LOAD_DB', response);
                break;
            }
            case 'EXEC_QUERY': {
                const { id, dbName, query } = data.args;
                const response = await execQuery(port, id, dbName, query);
                postResponse(port, 'EXEC_QUERY', response);
                break;
            }
            case 'CLOSE_DB': {
                const { dbName } = data.args;
                const response = await closeDB(port, dbName);
                postResponse(port, 'CLOSE_DB', response);
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
                        await getAvailableDBs();
                        postSuccess(port, 'TERMINATE_DB', { dbName });
                    })
                } else if (config.engine === DBEngine.PGSQL || config.engine === DBEngine.SQLITE) {
                    const iDBtoDelete = config.engine === DBEngine.PGSQL ? '/pglite/' + config.name : config.name;
                    const toDelete = indexedDB.deleteDatabase(iDBtoDelete);
                    toDelete.onsuccess = async () => {
                        await iDB.transaction('readwrite', iDB.databases, async () => {
                            await iDB.databases.delete(dbName);
                        }).then(async () => {
                            await getAvailableDBs();
                            postSuccess(port, 'TERMINATE_DB', { dbName });
                        })
                    }
                } else {
                    postError(port, 'TERMINATE_DB', {
                        name: 'INVALID_DB',
                        message: 'Unknown Database Engine',
                        cause: `Supported Engines: ${DBEngine.PGSQL}, ${DBEngine.SQLITE}, ${DBEngine.DUCKDB}`
                    });
                }
                break;
            }
            case 'CREATE_DEMO': {
                const { engine } = data.args;
                const dbName = `Sample-Chinook-${nanoid()}`;

                try {
                    const response = await fetch(`/samples/chinook-${engine}.txt`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const query = await response.text();

                    const dbResult = await createDB(port, dbName, engine, false);
                    if ('name' in dbResult) {
                        postError(port, 'CREATE_DEMO', dbResult);
                        return;
                    }

                    const queryResult = await execQuery(port, nanoid(), dbName, query);
                    if ('name' in queryResult) {
                        await closeDB(port, dbName);
                        postError(port, 'CREATE_DEMO', queryResult);
                        return;
                    }

                    postSuccess(port, 'CREATE_DEMO', { dbName });
                } catch {
                    postError(port, 'CREATE_DEMO', {
                        name: 'INVALID_ARG',
                        message: 'Sample Database creation failed',
                        cause: `Supported Sample Database for ${DBEngine.PGSQL}, ${DBEngine.SQLITE}`
                    });

                    if (DBS[dbName]) await closeDB(port, dbName);
                }

                break;
            }
        }
    };

    port.onmessageerror = (error) => {
        console.error('Message error:', error);
    };
};

export { };
