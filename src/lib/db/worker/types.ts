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

export type DBWorkerResponse =
    | { status: 'SUCCESS'; command: 'GET_ACTIVE_DBS'; response: { activeDBs: string[] } }
    | { status: 'SUCCESS'; command: 'GET_AVAILABLE_DBS'; response: { availableDBs: string[] } }
    | { status: 'SUCCESS'; command: 'CREATE_DB'; response: { dbName: string } }
    | { status: 'SUCCESS'; command: 'LOAD_DB'; response: { dbName: string } }
    | { status: 'SUCCESS'; command: 'CLOSE_DB'; response: { dbName: string } }
    | { status: 'ERROR'; command: string; response: string };
