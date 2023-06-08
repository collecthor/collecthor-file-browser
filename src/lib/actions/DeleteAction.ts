import type ContextMenuAction from '$lib/interfaces/ContextMenuAction';
import Delete from 'svelte-material-icons/Delete.svelte';
import type { external } from '$lib/interfaces/api.generated';
import type FileManager from '$lib/FileManager';
type Node = external['models/Node.json'];

export default class DeleteAction implements ContextMenuAction {
	name = 'Delete';
	icon = Delete;

	async action(item: Node, fileManager: FileManager) {
		fileManager.delete(item);
	}

	validFor(): boolean {
		return true;
	}
}
