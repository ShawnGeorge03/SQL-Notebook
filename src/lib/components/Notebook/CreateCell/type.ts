import type { DBEngine } from '$lib/db/worker/types';

export type CellMetadata =
	{ cellType: 'query'; dbName: string; engine: DBEngine }
	| { cellType: 'markdown' };

export type CreateCellBaseProps = {
	position: number;
	addNewCell: (
		position: number,
		metadata: CellMetadata
	) => void;
}