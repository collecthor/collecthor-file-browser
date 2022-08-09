import type { SvelteComponentTyped } from "svelte"
import type BackendFile from "./BackendFile"

export default interface ContextMenuAction {
  name: string
  icon: SvelteComponentTyped
  action: (item: BackendFile, items: BackendFile[]) => BackendFile[]
  filter: string[]
}