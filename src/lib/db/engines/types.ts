export type DBOptions = {
    persistent: boolean;
};

export type QueryResult = {
    rows: unknown[];
    cols: { name: string, type: string }[]
};

/**
 * Interface for classes that represent a Database
 *
 * @interface
 */
export interface DBStrategy {
    init(): Promise<void>;
    exec(query: string): Promise<unknown[]>;
    close(): Promise<void>;
}
