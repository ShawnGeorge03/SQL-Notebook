import { liveQuery } from 'dexie';
import { nanoid } from 'nanoid/non-secure';
import { writable } from 'svelte/store';

import iDB from '../schema';
import type { Notebook } from '../types';

export type NotebookStore = Omit<Notebook, 'cells'>;

export const notebooks = writable<NotebookStore[]>([]);

export const notebooksObservableIDB =
    liveQuery(() => iDB.notebooks.toArray())
        .subscribe({
            next: (results) => {
                notebooks.set(
                    results.map((result) => ({
                        id: result.id,
                        name: result.name,
                        createdBy: result.createdBy,
                        createdOn: result.createdOn,
                        modifiedOn: result.modifiedOn
                    }))
                );
            },
            error: (error) => console.error(error),
        });

const addNotebook = async (notebook: Notebook) => {
    iDB.transaction('readwrite', iDB.notebooks, async () => {
        await iDB.notebooks.add(notebook);
    });
};

export const createNotebook = (name: string) => {
    addNotebook({
        id: nanoid(),
        name,
        createdBy: 'user',
        createdOn: new Date().toISOString(),
        modifiedOn: new Date().toISOString(),
        cells: []
    });
};

export const duplicateNotebook = async (id: string) => {
    const notebook = await iDB.notebooks.get(id);

    if (!notebook) return;

    addNotebook({
        id: nanoid(),
        name: notebook.name,
        createdBy: 'user',
        createdOn: new Date().toISOString(),
        modifiedOn: new Date().toISOString(),
        cells: notebook.cells
    });
};

export const renameNotebook = async (id: string, name: string) => {
    await iDB.notebooks.update(id, { name })
}

export const deleteNotebook = async (id: string) => await iDB.notebooks.delete(id);
