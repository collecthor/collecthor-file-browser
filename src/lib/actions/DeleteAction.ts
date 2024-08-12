import type ContextMenuAction from '$lib/interfaces/ContextMenuAction';
import type { external } from '$lib/interfaces/api.generated';
import type FileManager from '$lib/FileManager';
import Delete from 'virtual:icons/mdi/delete';
type Node = external['models/Node.json'];

export default class DeleteAction implements ContextMenuAction {
	name = 'Delete';
	icon = Delete;

	async action(item: Node, fileManager: FileManager) {
		fileManager.delete(item);
	}

	validFor(item: Node): boolean {
		return item.permissions.delete;
	}
}
