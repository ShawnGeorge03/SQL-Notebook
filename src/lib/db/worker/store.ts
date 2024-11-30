import { writable } from 'svelte/store';
import type { DBWorkerMessage, DBWorkerResponse } from './types';

const dbWorkerMessagesStore = writable<DBWorkerMessage>();

const dbWorkerResponsesStore = writable<DBWorkerResponse>();

export { dbWorkerMessagesStore, dbWorkerResponsesStore };
