import type { DBEngine } from "$lib/db/worker/types";

export type AddCell =
    | undefined
    | { cell: 'sql'; dbName: string; engine: DBEngine }
    | { cell: 'markdown' | 'chart' | 'ai' };