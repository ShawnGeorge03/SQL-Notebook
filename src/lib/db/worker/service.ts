import { readable, type Readable } from "svelte/store";
import type { DBWorkerMessage, DBWorkerResponse } from "./types";

export class DBWorkerService {
    static #instance: DBWorkerService;
    #worker: SharedWorker;
    #port: MessagePort;

    responses: Readable<DBWorkerResponse>;

    private constructor() {
        this.#worker = new SharedWorker(new URL('$lib/db/worker/index.ts', import.meta.url), { type: 'module' });
        this.#port = this.#worker.port;

        this.responses = readable<DBWorkerResponse>({ status: "INITIALIZING" }, (set) => {
            this.#port.onmessage = (event: MessageEvent<DBWorkerResponse>) => {
                set(event.data);
            }
        })

        this.#port.onmessageerror = (event: MessageEvent) => {
            console.log('DBWorkerService: ', event.data);
        };

        this.#port.start();
    }

    static getInstance(): DBWorkerService {
        if (!DBWorkerService.#instance) {
            DBWorkerService.#instance = new DBWorkerService();
        }

        return DBWorkerService.#instance;
    }

    sendMessage(message: DBWorkerMessage) {
        this.#port.postMessage(message);
    }

    disconnect(): void {
        this.#port.close();
    }
}
