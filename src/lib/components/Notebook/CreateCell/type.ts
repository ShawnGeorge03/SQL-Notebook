import type { DBEngine } from '$lib/db/worker/types';

export type CellMetadata =
	{ cellType: 'query'; dbName: string; engine: DBEngine }
	| { cellType: 'markdown' };

export type CreateCellBaseProps = {
	class?: string;
	position: number;
	addNewCell: (
		position: number,
		metadata: CellMetadata
	) => void;
}