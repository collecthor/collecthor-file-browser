export default interface FileBrowserError {
	statusText: string;
	title: string;
	detail: unknown;
	status: number;
}

export function isFileBrowserError(o: unknown): o is FileBrowserError {
	return (
		o instanceof Object &&
		'detail' in o &&
		'title' in o &&
		'statusText' in o &&
		'status' in o &&
		typeof o.statusText == 'string' &&
		typeof o.title == 'string' &&
		typeof o.status == 'number'
	);
}
