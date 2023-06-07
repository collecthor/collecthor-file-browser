import type ContextMenuAction from "$lib/interfaces/ContextMenuAction";
import Eye from "svelte-material-icons/Eye.svelte";
import type { external } from "$lib/interfaces/api.generated";
import type FileManager from "$lib/FileManager";
type Node = external["models/Node.json"];

export default class DeleteAction implements ContextMenuAction {
  name = "Open";
  icon = Eye;

  async action(item: Node, fileManager: FileManager) {
    // todo implement this
    alert("not yet implemented");
  }

  validFor(item: Node): boolean {
    return item.mimeType !== "inode/directory";
  }
}
