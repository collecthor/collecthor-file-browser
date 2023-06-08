import type { CreateRequest } from '$lib/generated/CreateRequest';
import type { Node } from '$lib/generated/Node';
import type FileBrowserError from '$lib/interfaces/FileBrowserError';
import type ErrorResponse from '$lib/interfaces/ErrorResponse';

/**
 * Upload a file to the server and returns the uploaded file
 *
 * @param baseurl The main URL where the API resides
 * @param currentPath The currently active filepath (e.g. for FE local folders)
 * @param name Name of the file
 * @param mimeType MimeType of the file
 * @param dataUrl The actual data (encoded)
 * @param errorHandler A callback to an error handler that we can call to show the correct error
 */
export async function uploadFile(
	baseurl: string,
	currentPath: string,
	name: string,
	mimeType: string,
	dataUrl: string,
	errorHandler: Function
) {
	const body: CreateRequest = {
		path: currentPath,
		name: name,
		mimeType: mimeType,
		uri: dataUrl
	};

	const response = await fetch(`${baseurl}/create`, {
		method: 'POST',
		credentials: 'same-origin',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (response.status === 200) {
		/**
		 * TODO: Make sure data is actually of type Node
		 */
		const data: Node = await response.json();

		return data as Node;
	} else {
		/**
		 * TODO: Make sure data is actually of type ErrorResponse
		 */
		const { errors }: ErrorResponse = await response.json();
		if (errors.length > 0) {
			errorHandler(errors[0] as FileBrowserError);
		}
	}

	return undefined;
}
