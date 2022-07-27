import type BackendFile from "./BackendFile"
import type { IconDefinition } from "../../node_modules/@fortawesome/fontawesome-common-types/index";

export default interface ContextMenuAction {
  name: string
  icon: IconDefinition
  action: (item: BackendFile) => void
}