// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// Copyright 2024 Roy T. Hashimoto. All Rights Reserved.
import * as CONSTS from 'wa-sqlite/src/sqlite-constants.js';

const DEFAULT_SECTOR_SIZE = 512;

// Base class for a VFS.
export class Base {
	name;
	mxPathname = 64;
	_module;

	/**
	 * @param {string} name
	 * @param {object} module
	 */
	constructor(name, module) {
		this.name = name;
		this._module = module;
	}

	/**
	 * @returns {void|Promise<void>}
	 */
	close() {}

	/**
	 * @returns {boolean|Promise<boolean>}
	 */
	isReady() {
		return true;
	}

	/**
	 * Overload in subclasses to indicate which methods are asynchronous.
	 * @param {string} methodName
	 * @returns {boolean}
	 */
	hasAsyncMethod(methodName) {
		return false;
	}

	/**
	 * @param {number} pVfs
	 * @param {number} zName
	 * @param {number} pFile
	 * @param {number} flags
	 * @param {number} pOutFlags
	 * @returns {number|Promise<number>}
	 */
	xOpen(pVfs, zName, pFile, flags, pOutFlags) {
		return CONSTS.SQLITE_CANTOPEN;
	}

	/**
	 * @param {number} pVfs
	 * @param {number} zName
	 * @param {number} syncDir
	 * @returns {number|Promise<number>}
	 */
	xDelete(pVfs, zName, syncDir) {
		return CONSTS.SQLITE_OK;
	}

	/**
	 * @param {number} pVfs
	 * @param {number} zName
	 * @param {number} flags
	 * @param {number} pResOut
	 * @returns {number|Promise<number>}
	 */
	xAccess(pVfs, zName, flags, pResOut) {
		return CONSTS.SQLITE_OK;
	}

	/**
	 * @param {number} pVfs
	 * @param {number} zName
	 * @param {number} nOut
	 * @param {number} zOut
	 * @returns {number|Promise<number>}
	 */
	xFullPathname(pVfs, zName, nOut, zOut) {
		return CONSTS.SQLITE_OK;
	}

	/**
	 * @param {number} pVfs
	 * @param {number} nBuf
	 * @param {number} zBuf
	 * @returns {number|Promise<number>}
	 */
	xGetLastError(pVfs, nBuf, zBuf) {
		return CONSTS.SQLITE_OK;
	}

	/**
	 * @param {number} pFile
	 * @returns {number|Promise<number>}
	 */
	xClose(pFile) {
		return CONSTS.SQLITE_OK;
	}

	/**
	 * @param {number} pFile
	 * @param {number} pData
	 * @param {number} iAmt
	 * @param {number} iOffsetLo
	 * @param {number} iOffsetHi
	 * @returns {number|Promise<number>}
	 */
	xRead(pFile, pData, iAmt, iOffsetLo, iOffsetHi) {
		return CONSTS.SQLITE_OK;
	}

	/**
	 * @param {number} pFile
	 * @param {number} pData
	 * @param {number} iAmt
	 * @param {number} iOffsetLo
	 * @param {number} iOffsetHi
	 * @returns {number|Promise<number>}
	 */
	xWrite(pFile, pData, iAmt, iOffsetLo, iOffsetHi) {
		return CONSTS.SQLITE_OK;
	}

	/**
	 * @param {number} pFile
	 * @param {number} sizeLo
	 * @param {number} sizeHi
	 * @returns {number|Promise<number>}
	 */
	xTruncate(pFile, sizeLo, sizeHi) {
		return CONSTS.SQLITE_OK;
	}

	/**
	 * @param {number} pFile
	 * @param {number} flags
	 * @returns {number|Promise<number>}
	 */
	xSync(pFile, flags) {
		return CONSTS.SQLITE_OK;
	}

	/**
	 *
	 * @param {number} pFile
	 * @param {number} pSize
	 * @returns {number|Promise<number>}
	 */
	xFileSize(pFile, pSize) {
		return CONSTS.SQLITE_OK;
	}

	/**
	 * @param {number} pFile
	 * @param {number} lockType
	 * @returns {number|Promise<number>}
	 */
	xLock(pFile, lockType) {
		return CONSTS.SQLITE_OK;
	}

	/**
	 * @param {number} pFile
	 * @param {number} lockType
	 * @returns {number|Promise<number>}
	 */
	xUnlock(pFile, lockType) {
		return CONSTS.SQLITE_OK;
	}

	/**
	 * @param {number} pFile
	 * @param {number} pResOut
	 * @returns {number|Promise<number>}
	 */
	xCheckReservedLock(pFile, pResOut) {
		return CONSTS.SQLITE_OK;
	}

	/**
	 * @param {number} pFile
	 * @param {number} op
	 * @param {number} pArg
	 * @returns {number|Promise<number>}
	 */
	xFileControl(pFile, op, pArg) {
		return CONSTS.SQLITE_NOTFOUND;
	}

	/**
	 * @param {number} pFile
	 * @returns {number|Promise<number>}
	 */
	xSectorSize(pFile) {
		return DEFAULT_SECTOR_SIZE;
	}

	/**
	 * @param {number} pFile
	 * @returns {number|Promise<number>}
	 */
	xDeviceCharacteristics(pFile) {
		return 0;
	}
}

export const FILE_TYPE_MASK = [
	CONSTS.SQLITE_OPEN_MAIN_DB,
	CONSTS.SQLITE_OPEN_MAIN_JOURNAL,
	CONSTS.SQLITE_OPEN_TEMP_DB,
	CONSTS.SQLITE_OPEN_TEMP_JOURNAL,
	CONSTS.SQLITE_OPEN_TRANSIENT_DB,
	CONSTS.SQLITE_OPEN_SUBJOURNAL,
	CONSTS.SQLITE_OPEN_SUPER_JOURNAL,
	CONSTS.SQLITE_OPEN_WAL
].reduce((mask, element) => mask | element);
