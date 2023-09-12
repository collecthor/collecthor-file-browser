import type ContextMenuAction from '$lib/interfaces/ContextMenuAction';
import type { external } from '$lib/interfaces/api.generated';
import type FileManager from '$lib/FileManager';
import Icon from '@collecthor/svelte-material-icons/dist/generated/ContentCopy.svelte';
type Node = external['models/Node.json'];

export default class CopyUrlAction implements ContextMenuAction {
	name = 'Copy URL';
	icon = Icon;
	async action(item: Node, fileManager: FileManager) {
		const url = await fileManager.getUrl(item);
		await navigator.clipboard.writeText(url.toString());
	}

	validFor(): boolean {
		return true;
	}
}
