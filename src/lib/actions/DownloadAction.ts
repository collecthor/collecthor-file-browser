import type ContextMenuAction from '$lib/interfaces/ContextMenuAction';
import type { external } from '$lib/interfaces/api.generated';
import type FileManager from '$lib/FileManager';
import Download from 'virtual:icons/mdi/download';
type Node = external['models/Node.json'];

export default class DownloadAction implements ContextMenuAction {
	name = 'Download';
	icon = Download;

	async action(item: Node, fileManager: FileManager) {
		fileManager.download(item);
	}

	validFor(item: Node): boolean {
		return item.mimeType !== 'inode/directory';
	}
}
