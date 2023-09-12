import type { external } from '$lib/interfaces/api.generated.d.ts';

import FetchApiClient from '$lib/FetchApiClient';
type CreateRequest = external['models/CreateRequest.json'];
type Path = external['models/Path.json'];

export type FetchRequest =
	| {
			port: MessagePort;
			method: 'createFile';
			arg: CreateRequest;
	  }
	| {
			port: MessagePort;
			method: 'deleteFile' | 'viewPath' | 'getUrl';
			arg: Path;
	  }
	| {
			port: MessagePort;
			method: 'moveFile';
			arg: { source: Path; destination: Path };
	  };
/**
 * This proxy listens on the given port and forwards requests to the client.
 *
 */
export default class PostMessageApiProxy {
	private client: FetchApiClient;

	constructor(baseUrl?: string) {
		this.client = new FetchApiClient(baseUrl);
	}

	listenToPort(port: MessagePort): void {
		port.onmessage = async (ev: MessageEvent<FetchRequest>) => {
			let result;
			try {
				switch (ev.data.method) {
					case 'createFile':
						result = await this.client.createFile(ev.data.arg);
						break;
					case 'moveFile':
						result = await this.client.moveFile(ev.data.arg.source, ev.data.arg.destination);
						break;
					default:
						result = await this.client[ev.data.method](ev.data.arg);
				}
				ev.data.port.postMessage({ result });
			} catch (error) {
				ev.data.port.postMessage({ error });
			}
		};
	}
}
