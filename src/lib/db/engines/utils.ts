import { type FormatOptionsWithLanguage } from 'sql-formatter';
import type { DBEngine } from '../worker/types';

const getSQLFormatConfig = (engine: DBEngine): FormatOptionsWithLanguage => {
	return {
		language: engine === 'pgsql' ? 'postgresql' : engine === 'sqlite' ? 'sqlite' : 'sql',
		keywordCase: 'upper',
		newlineBeforeSemicolon: true
	};
};

export default getSQLFormatConfig;
