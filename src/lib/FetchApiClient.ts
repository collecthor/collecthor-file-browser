import type { external, operations, paths } from '$lib/interfaces/api.generated.d.ts';

import type ApiClient from '$lib/interfaces/ApiClient';

import createClient from 'openapi-fetch';
import type FileBrowserError from './interfaces/FileBrowserError';

type CreateRequest = external['models/CreateRequest.json'];
type Path = external['models/Path.json'];

/**
 * This postmessage client does not do any type checking.
 */
export default class FetchApiClient implements ApiClient {
	private client: ReturnType<typeof createClient<paths>>;

	constructor(baseUrl?: string, fetcher?: typeof fetch) {
		this.client = createClient<paths>({
			baseUrl,
			fetch: fetcher
		});
	}

	public async createFile(
		file: CreateRequest
	): Promise<operations['post-create']['responses']['200']['content']['application/json']> {
		const { data, error, response } = await this.client.post('/create', {
			body: file
		});
		if (typeof data != 'undefined') {
			return data;
		}
		throw <FileBrowserError>{
			status: response.status,
			statusText: response.statusText,
			detail: error,
			title: 'Error'
		};
	}

	public async viewPath(
		path: Path
	): Promise<operations['post-view']['responses']['200']['content']['application/json']> {
		const { data, error } = await this.client.post('/view', {
			headers: {
				Prefer: 'code=200, example=Example 1'
			},
			body: { path }
		});
		if (typeof data != 'undefined') {
			return data;
		}
		throw error;
	}

	public async getUrl(
		path: Path
	): Promise<operations['post-url']['responses']['200']['content']['application/json']> {
		const { data, error } = await this.client.post('/url', {
			body: { path }
		});
		if (typeof data != 'undefined') {
			return data;
		}
		throw error;
	}

	public async deleteFile(path: Path): Promise<void> {
		const { error } = await this.client.post('/delete', {
			body: { path }
		});
		if (typeof error != 'undefined') {
			throw error;
		}
	}
}
