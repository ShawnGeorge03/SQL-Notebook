export type QueryResult = {
	data?: unknown;
	error?: string;
	elapsed?: number;
};

export interface DatabaseStrategy {
	db: unknown;
	dbName: string;

	init(): Promise<void>;
	exec(query: string): Promise<QueryResult>;
	close(): Promise<void>;
}

export type DBOptions = {
	engine: 'pgsql' | 'sqlite' | 'duckdb';
	dbName: string;
	persistent: boolean;
};

type DBManagerCommands =
	| 'GET_ACTIVE_DBS'
	| 'GET_AVAILABLE_DBS'
	| 'CREATE_DB'
	| 'LOAD_DB'
	| 'EXEC_QUERY'
	| 'CLOSE_DB';

type CommandWithoutArgs<C extends DBManagerCommands> = { command: C };
type CommandWithArgs<C extends DBManagerCommands, A> = { command: C; args: A };

export type DBManagerMessage =
	| CommandWithoutArgs<'GET_ACTIVE_DBS'>
	| CommandWithoutArgs<'GET_AVAILABLE_DBS'>
	| CommandWithArgs<'CREATE_DB', DBOptions>
	| CommandWithArgs<'LOAD_DB', DBOptions>
	| CommandWithArgs<'EXEC_QUERY', { dbName: string; query: string }>
	| CommandWithArgs<'CLOSE_DB', { dbName: string }>;

export type DBManagerResponse =
	| { status: 'SUCCESS'; command: 'GET_ACTIVE_DBS'; response: { activeDBs: string[] } }
	| { status: 'SUCCESS'; command: 'GET_AVAILABLE_DBS'; response: { availableDBs: string[] } }
	| { status: 'SUCCESS'; command: 'CREATE_DB'; response: { dbName: string } }
	| { status: 'SUCCESS'; command: 'LOAD_DB'; response: { dbName: string } }
	| { status: 'SUCCESS'; command: 'CLOSE_DB'; response: { dbName: string } }
	| { status: 'ERROR'; command: string; response: string };
