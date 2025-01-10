import type { QueryResult } from '../engines/types';

/** Supported database engines */
export enum DBEngine {
	PGSQL = 'pgsql',
	SQLITE = 'sqlite'
}
export type DBInfo = {
	name: string;
	engine: DBEngine;
	persistent: boolean;
};

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
	| 'DROP_DB'
	| 'CREATE_DEMO'
	| 'FORMAT_QUERY';

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
	| Message<'DROP_DB', { dbName: string }>
	| Message<'CREATE_DEMO', { engine: DBEngine }>
	| Message<'FORMAT_QUERY', { id: string; engine: DBEngine; query: string }>;

/** Success response data for each command */
export interface DBWorkerSuccessResponse {
	GET_ACTIVE_DBS: { activeDBs: DBInfo[] };
	GET_AVAILABLE_DBS: { availableDBs: DBInfo[] };
	CREATE_DB: { dbName: string };
	LOAD_DB: { dbName: string };
	EXEC_QUERY: { id: string; data: QueryResult; elapsed: number };
	CLOSE_DB: { dbName: string };
	DROP_DB: { dbName: string };
	CREATE_DEMO: { dbName: string };
	FORMAT_QUERY: { query: string; id: string };
}

/** Error response data for each command */
export interface DBWorkerErrorResponse {
	GET_ACTIVE_DBS: Error;
	GET_AVAILABLE_DBS: Error;
	CREATE_DB: Error;
	LOAD_DB: Error;
	EXEC_QUERY: Error & { id: string };
	CLOSE_DB: Error;
	DROP_DB: Error;
	CREATE_DEMO: Error;
	FORMAT_QUERY: Error & { id: string };
}

/** Response format for each command */
export type DBWorkerResponse<C extends DBWorkerCommand> =
	| { status: 'SUCCESS'; command: C; data: DBWorkerSuccessResponse[C] }
	| { status: 'ERROR'; command: C; data: DBWorkerErrorResponse[C] };

/** Consolidated worker responses */
export type DBWorkerResponses =
	| { status: 'INITIALIZING' | 'INITIALIZED' }
	| DBWorkerResponse<'GET_ACTIVE_DBS'>
	| DBWorkerResponse<'GET_AVAILABLE_DBS'>
	| DBWorkerResponse<'CREATE_DB'>
	| DBWorkerResponse<'LOAD_DB'>
	| DBWorkerResponse<'EXEC_QUERY'>
	| DBWorkerResponse<'CLOSE_DB'>
	| DBWorkerResponse<'DROP_DB'>
	| DBWorkerResponse<'CREATE_DEMO'>
	| DBWorkerResponse<'FORMAT_QUERY'>;
