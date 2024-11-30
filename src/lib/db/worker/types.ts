import type { QueryResult } from "../engines/types";

type DBOptions = {
    engine: 'pgsql' | 'sqlite' | 'duckdb';
    dbName: string;
    persistent: boolean;
};

export type DBWorkerStatus =
    | 'INITIALIZING'
    | 'INITIALIZED'
    | 'LOADING';

export type DBWorkerCommands =
    | 'GET_ACTIVE_DBS'
    | 'GET_AVAILABLE_DBS'
    | 'CREATE_DB'
    | 'LOAD_DB'
    | 'EXEC_QUERY'
    | 'CLOSE_DB';

type Message<C extends DBWorkerCommands, R = undefined> =
    R extends undefined
    ? { command: C }
    : { command: C; args: R };

// Comprehensive worker message type
export type DBWorkerMessage =
    | Message<'GET_ACTIVE_DBS'>
    | Message<'GET_AVAILABLE_DBS'>
    | Message<'CREATE_DB', DBOptions>
    | Message<'LOAD_DB', DBOptions>
    | Message<'EXEC_QUERY', { dbName: string; query: string }>
    | Message<'CLOSE_DB', { dbName: string }>;

export type SuccessResponseData = {
    'GET_ACTIVE_DBS': { activeDBs: string[] };
    'GET_AVAILABLE_DBS': { availableDBs: string[] };
    'CREATE_DB': { dbName: string };
    'LOAD_DB': { dbName: string };
    'EXEC_QUERY': QueryResult
    'CLOSE_DB': { dbName: string };
};

type SuccessResponse<C extends keyof SuccessResponseData> = {
    status: 'SUCCESS';
    command: C;
    data: SuccessResponseData[C];
};

export type DBWorkerResponse =
    | { status: 'INITIALIZING' }
    | { status: 'INITIALIZED' }
    | { status: 'LOADING'; command?: DBWorkerCommands }
    | SuccessResponse<'GET_ACTIVE_DBS'>
    | SuccessResponse<'GET_AVAILABLE_DBS'>
    | SuccessResponse<'CREATE_DB'>
    | SuccessResponse<'LOAD_DB'>
    | SuccessResponse<'EXEC_QUERY'>
    | SuccessResponse<'CLOSE_DB'>
    | {
        status: 'ERROR';
        command: DBWorkerCommands;
        data: {
            message: string;
            cause?: unknown;
        };
    };