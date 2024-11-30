import type { DBOptions } from "../types";

type DBWorkerCommands =
    | 'GET_ACTIVE_DBS'
    | 'GET_AVAILABLE_DBS'
    | 'CREATE_DB'
    | 'LOAD_DB'
    | 'EXEC_QUERY'
    | 'CLOSE_DB';

type CommandWithoutArgs<C extends DBWorkerCommands> = { command: C };
type CommandWithArgs<C extends DBWorkerCommands, A> = { command: C; args: A };

export type DBWorkerMessage =
    | CommandWithoutArgs<'GET_ACTIVE_DBS'>
    | CommandWithoutArgs<'GET_AVAILABLE_DBS'>
    | CommandWithArgs<'CREATE_DB', DBOptions>
    | CommandWithArgs<'LOAD_DB', DBOptions>
    | CommandWithArgs<'EXEC_QUERY', { dbName: string; query: string }>
    | CommandWithArgs<'CLOSE_DB', { dbName: string }>;

type SuccessResponse<C extends DBWorkerCommands, R> = {
    status: 'SUCCESS';
    command: C;
    response: R;
};

export type DBWorkerResponse =
    | { status: 'READY' }
    | { status: 'LOADING'; command: DBWorkerCommands }
    | SuccessResponse<'GET_ACTIVE_DBS', { activeDBs: string[] }>
    | SuccessResponse<'GET_AVAILABLE_DBS', { availableDBs: string[] }>
    | SuccessResponse<'CREATE_DB', { dbName: string }>
    | SuccessResponse<'LOAD_DB', { dbName: string }>
    | SuccessResponse<'CLOSE_DB', { dbName: string }>
    | {
        status: 'ERROR';
        command: DBWorkerCommands;
        response: string;
    };