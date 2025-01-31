import { dev } from '$app/environment';
import { readable, type Readable } from 'svelte/store';
import { type DBWorkerMessages, type DBWorkerResponses } from './types';

export class DBWorkerService {
	static #instance: DBWorkerService;
	#worker: SharedWorker;
	#port: MessagePort;

	responses: Readable<DBWorkerResponses>;

	private constructor() {
		this.#worker = new SharedWorker(new URL('$lib/db/worker/index.ts', import.meta.url), {
			type: 'module'
		});
		this.#port = this.#worker.port;

		this.responses = readable<DBWorkerResponses>({ status: 'INITIALIZING' }, (set) => {
			this.#port.onmessage = (event: MessageEvent<DBWorkerResponses>) => {
				if (dev) console.log(event.data);
				set(event.data);
			};
		});

		this.#port.onmessageerror = (event: MessageEvent) => {
			console.error('DBWorkerService: ', event.data);
		};

		this.#port.start();
	}

	static getInstance(): DBWorkerService {
		if (!DBWorkerService.#instance) {
			DBWorkerService.#instance = new DBWorkerService();
		}

		return DBWorkerService.#instance;
	}

	sendMessage(message: DBWorkerMessages) {
		this.#port.postMessage(message);
	}

	disconnect(): void {
		this.#port.close();
	}
}
