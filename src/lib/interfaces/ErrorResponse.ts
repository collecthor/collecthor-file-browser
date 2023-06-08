import type FileBrowserError from '$lib/interfaces/FileBrowserError';

export default interface ErrorResponse {
	errors: Array<FileBrowserError>;
}
