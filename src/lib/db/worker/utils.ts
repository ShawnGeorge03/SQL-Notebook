import type {
	DBWorkerCommand,
	DBWorkerStatus,
	ErrorResponseData,
	SuccessResponseData
} from "./types";

// Post a status message to the worker's port
export const postStatus = (
	port: MessagePort,
	status: DBWorkerStatus,
	command?: DBWorkerCommand,
) => {
	port.postMessage(command ? { status, command } : { status });
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
export const postError = <C extends keyof ErrorResponseData>(
	port: MessagePort,
	command: C,
	data: ErrorResponseData[C]
) => {
	port.postMessage({
		status: 'ERROR',
		command,
		data
	});
};