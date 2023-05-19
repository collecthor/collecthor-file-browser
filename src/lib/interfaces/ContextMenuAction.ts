import type { SvelteComponentTyped } from "svelte"
import type { Node } from "$lib/generated/Node"

export default interface ContextMenuAction {
  name: string
  icon: SvelteComponentTyped
  /**
   *
   * @param targetItem The item that is being targeted by the action
   * @param pathContents The list of items that is currently in the path
   * @returns The list of items in the path after execution, this is used for an optimistic updated of the UI
   */
  action: (targetItem: Node, pathContents: Node[]) => Promise<Node[]>

  /**
   * Whether this action is valid for the given targetItem
   */
  validFor: (targetItem: Node) => boolean
}