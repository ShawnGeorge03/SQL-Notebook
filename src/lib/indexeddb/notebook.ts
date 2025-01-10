import { nanoid } from 'nanoid/non-secure';

import iDB from './schema';
import type { Notebook } from './types';

export type NotebookStore = Omit<Notebook, 'cells'>;

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

	if (notebook)
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
	await iDB.notebooks.update(id, { name });
};

export const deleteNotebook = async (id: string) => await iDB.notebooks.delete(id);
