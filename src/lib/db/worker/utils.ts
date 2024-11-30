// utils.ts
import type {
	DBWorkerCommands,
	DBWorkerStatus,
	SuccessResponseData
} from "./types";

// Post a status message to the worker's port
export const postStatus = (
	port: MessagePort,
	status: DBWorkerStatus,
	command?: DBWorkerCommands,
) => {
	port.postMessage({ status, command });
};

// Post a success message with type-safe response data
export const postSuccess = <C extends keyof SuccessResponseData>(
	port: MessagePort,
	command: C,
	data: SuccessResponseData[C]
) => {
	port.postMessage({
		status: 'SUCCESS',
		command,
		data
	});
};

// Post an error message with detailed error information
export const postError = (
	port: MessagePort,
	command: DBWorkerCommands,
	message: string,
	cause?: unknown
) => {
	port.postMessage({
		status: 'ERROR',
		command,
		data: {
			message,
			cause
		}
	});
};