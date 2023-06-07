export default interface FileBrowserError {
  statusText: string;
  title: string;
  detail: unknown;
  status: number;
}

export function isFileBrowserError(o: any): o is FileBrowserError {
  return (
    o instanceof Object &&
    "detail" in o &&
    typeof o.statusText == "string" &&
    typeof o.title == "string" &&
    typeof o.status == "number"
  );
}
