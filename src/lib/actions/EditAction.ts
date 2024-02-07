import type ContextMenuAction from '$lib/interfaces/ContextMenuAction';
import type { external } from '$lib/interfaces/api.generated';
import type FileManager from '$lib/FileManager';
import FileEdit from 'virtual:icons/mdi/file-edit';
import 'winbox/src/css/winbox.css';
import WinBox from 'winbox/src/js/winbox';
import Editor from '$lib/Editor.svelte';
type Node = external['models/Node.json'];

export default class EditAction implements ContextMenuAction {
	name = 'Edit';
	icon = FileEdit;
	async action(item: Node, fileManager: FileManager) {
		const winBox = new WinBox(item.name, {});
		const editor = new Editor({
			target: winBox.body,
			props: {
				fileManager,
				node: item
			}
		});
		winBox.onclose = () => {
			editor.$destroy();
			return false;
		};
	}

	validFor(item: Node): boolean {
		return [
			'application/text',
			'text/plain',
			'text/javascript',
			'application/javascript',
			'text/html',
			'text/css',
			'application/json'
		].includes(item.mimeType);
	}
}
