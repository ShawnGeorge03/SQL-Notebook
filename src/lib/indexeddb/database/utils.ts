import { liveQuery } from 'dexie';
import { writable } from 'svelte/store';

import iDB from '../schema';
import type { Database } from '../types';


export const databases = writable<Database[]>([]);

export const databasesObservableIDB =
    liveQuery(() => iDB.databases.toArray())
        .subscribe({
            next: (results) => databases.set(results),
            error: (error) => console.error(error),
        });
