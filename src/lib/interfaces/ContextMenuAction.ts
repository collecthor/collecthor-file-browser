import type FileManager from "$lib/FileManager";
import type { external } from "$lib/interfaces/api.generated.d.ts";
import type Delete from "svelte-material-icons/Delete.svelte";

type Node = external["models/Node.json"];
/**
 *
 * @param targetItem The item that is being targeted by the action
 * @param pathContents The list of items that is currently in the path
 */
export type Action = (targetItem: Node, fileManager: FileManager) => void;

export default interface ContextMenuAction {
  name: string;
  icon: typeof Delete;

  action(targetItem: Node, fileManager: FileManager): void;

  /**
   * Whether this action is valid for the given targetItem
   */
  validFor(targetItem: Node): boolean;
}
