const postSuccess = (port: MessagePort, command: string, response: unknown = {}) => {
	port.postMessage({ status: 'SUCCESS', command, response });
};

const postError = (port: MessagePort, command: string, response: string) => {
	port.postMessage({ status: 'ERROR', command, response });
};

export { postError, postSuccess };
