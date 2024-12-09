import Dexie, { type EntityTable } from 'dexie';
import { type Database, type Notebook, type Project, } from './types';

export const iDBname = 'sql-notebook' as const;

const iDB = new Dexie(iDBname) as Dexie & {
    databases: EntityTable<Database, 'name'>;
    notebooks: EntityTable<Notebook, 'id'>;
    projects: EntityTable<Project, 'id'>;
};

iDB.version(1).stores({
    databases: '&name, createdBy, createdOn, modifiedOn, engine, system',
    notebooks: '++id, name, createdBy, createdOn, modifiedOn, projectID',
    projects: '++id, name, createdBy, createdOn, modifiedOn, *notebookIDs'
});

export default iDB