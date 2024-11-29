const postSuccess = (port: MessagePort, command: string, response: unknown = {}) => {
	port.postMessage({ status: 'SUCCESS', command, response });
};

const postError = (port: MessagePort, command: string, response: string) => {
	port.postMessage({ status: 'ERROR', command, response });
};

// TODO: Move it to a seperate file containing IndedxDB queries
// TODO: Make use of dexie.js instead
const getAvailableDBs = async () => {
	const availableDBs = new Set<string>();

	try {
		const databases = await indexedDB.databases();
		for (const db of databases) {
			if (db.name) {
				const dbName = db.name.startsWith('/pglite/') ? db.name.slice(8) : db.name;
				availableDBs.add(dbName);
			}
		}

		return availableDBs;
	} catch (error) {
		console.error('Failed to fetch available databases:', error);
		return availableDBs;
	}
};

export { getAvailableDBs, postError, postSuccess };
