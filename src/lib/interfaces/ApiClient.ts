import type { operations, external } from '$lib/interfaces/api.generated.d';

type CreateRequest = external['models/CreateRequest.json'];
type Path = external['models/Path.json'];

export default interface ApiClient {
	createFile(
		file: CreateRequest
	): Promise<operations['post-create']['responses']['200']['content']['application/json']>;

	viewPath(
		path: Path
	): Promise<operations['post-view']['responses']['200']['content']['application/json']>;

	getUrl(
		path: Path
	): Promise<operations['post-url']['responses']['200']['content']['application/json']>;

	deleteFile(path: Path): Promise<void>;
}
