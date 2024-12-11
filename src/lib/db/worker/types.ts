import type { QueryResult } from '../engines/types';

/** Supported database engines */
export enum DBEngine {
    PGSQL = 'pgsql',
    SQLITE = 'sqlite',
    DUCKDB = 'duckdb',
}
export type DBInfo = {
    name: string;
    engine: DBEngine;
    persistent: boolean;
}

/** Worker statuses */
export type DBWorkerStatus = 'INITIALIZING' | 'INITIALIZED' | 'LOADING';

/** Commands handled by the DB worker */
export type DBWorkerCommand =
    | 'GET_ACTIVE_DBS'
    | 'GET_AVAILABLE_DBS'
    | 'CREATE_DB'
    | 'LOAD_DB'
    | 'EXEC_QUERY'
    | 'CLOSE_DB'
    | 'TERMINATE_DB';

/** Message format */
type Message<C extends DBWorkerCommand, R = undefined> = R extends undefined
    ? { command: C }
    : { command: C; args: R };

/** All messages supported by the DB worker */
export type DBWorkerMessages =
    | Message<'GET_ACTIVE_DBS'>
    | Message<'GET_AVAILABLE_DBS'>
    | Message<'CREATE_DB', { engine: DBEngine; dbName: string; persistent: boolean }>
    | Message<'LOAD_DB', { dbName: string }>
    | Message<'EXEC_QUERY', { id: string; dbName: string; query: string }>
    | Message<'CLOSE_DB', { dbName: string }>
    | Message<'TERMINATE_DB', { dbName: string }>;

/** Success response data for each command */
export interface SuccessResponseData {
    GET_ACTIVE_DBS: { activeDBs: DBInfo[] };
    GET_AVAILABLE_DBS: { availableDBs: DBInfo[] };
    CREATE_DB: { dbName: string };
    LOAD_DB: { dbName: string };
    EXEC_QUERY: QueryResult & { id: string };
    CLOSE_DB: { dbName: string };
    TERMINATE_DB: { dbName: string };
}

/** Error response data for each command */
export interface ErrorResponseData {
    GET_ACTIVE_DBS: Error;
    GET_AVAILABLE_DBS: Error;
    CREATE_DB: Error;
    LOAD_DB: Error;
    EXEC_QUERY: Error & { id: string };
    CLOSE_DB: Error;
    TERMINATE_DB: Error;
}

/** Response format for each command */
type Response<C extends DBWorkerCommand> =
    | { status: 'LOADING'; command: C }
    | { status: 'SUCCESS'; command: C; data: SuccessResponseData[C] }
    | { status: 'ERROR'; command: C; data: ErrorResponseData[C] };

/** Consolidated worker responses */
export type DBWorkerResponses =
    | { status: 'INITIALIZING' | 'INITIALIZED' }
    | Response<'GET_ACTIVE_DBS'>
    | Response<'GET_AVAILABLE_DBS'>
    | Response<'CREATE_DB'>
    | Response<'LOAD_DB'>
    | Response<'EXEC_QUERY'>
    | Response<'CLOSE_DB'>
    | Response<'TERMINATE_DB'>;
