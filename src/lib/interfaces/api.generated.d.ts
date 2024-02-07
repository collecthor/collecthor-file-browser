/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

/** OneOf type helpers */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
type OneOf<T extends any[]> = T extends [infer Only]
	? Only
	: T extends [infer A, infer B, ...infer Rest]
		? OneOf<[XOR<A, B>, ...Rest]>
		: never;

export interface paths {
	'/view': {
		/**
		 * View
		 * @description View all files(and folders) in a path
		 */
		post: operations['post-view'];
	};
	'/url': {
		/**
		 * View
		 * @description Retrieves / generates a publicly accessible URL for the file
		 */
		post: operations['post-url'];
	};
	'/create': {
		/**
		 * Create
		 * @description Create a file or folder at the specified path
		 */
		post: operations['post-create'];
	};
	'/delete': {
		/**
		 * Delete file
		 * @description Delete a file or folder from the filesystem
		 */
		post: operations['post-delete'];
	};
	'/move': {
		/**
		 * Move file
		 * @description Move a file on the filesystem
		 */
		post: operations['post-move'];
	};
	'/copy': {
		/**
		 * Copy file
		 * @description Move a file on the filesystem
		 */
		post: operations['post-copy'];
	};
}

export type webhooks = Record<string, never>;

export interface components {
	schemas: {};
	responses: never;
	parameters: never;
	requestBodies: never;
	headers: never;
	pathItems: never;
}

export interface external {
	'models/CreateRequest.json': {
		path: external['models/Path.json'];
		name: string;
		mimeType: external['models/MimeType.json'];
		/**
		 * Format: uri
		 * @description The URI must be a data URI
		 */
		uri: string;
	};
	'models/MimeType.json': string;
	'models/Node.json': {
		name: string;
		path: external['models/Path.json'];
		/** @description Size of the file in bytes, null if not applicable */
		size: OneOf<[number, null]>;
		/** @description For directories we use `inode/directory` */
		mimeType: external['models/MimeType.json'];
		permissions: external['models/PermissionSet.json'];
		/** Format: uri */
		icon: OneOf<[string, null]>;
	};
	'models/Path.json': string;
	'models/PathRequest.json': {
		path: external['models/Path.json'];
	};
	'models/PermissionSet.json': {
		/** @description This is the read permission */
		read: boolean;
		write: boolean;
		create: boolean;
		delete: boolean;
		[key: string]: boolean | undefined;
	};
	'models/PublicUri.json': {
		/** Format: uri */
		uri: string;
		/** Format: date-time */
		expires: OneOf<[string, null]>;
		name: string;
		mimeType: external['models/MimeType.json'];
		path: external['models/Path.json'];
	};
}

export interface operations {
	/**
	 * View
	 * @description View all files(and folders) in a path
	 */
	'post-view': {
		requestBody?: {
			content: {
				'application/json': external['models/PathRequest.json'];
			};
		};
		responses: {
			/** @description OK */
			200: {
				content: {
					'application/json': external['models/Node.json'][];
				};
			};
		};
	};
	/**
	 * View
	 * @description Retrieves / generates a publicly accessible URL for the file
	 */
	'post-url': {
		requestBody?: {
			content: {
				'application/json': external['models/PathRequest.json'];
			};
		};
		responses: {
			/** @description OK */
			200: {
				content: {
					'application/json': external['models/PublicUri.json'];
				};
			};
		};
	};
	/**
	 * Create
	 * @description Create a file or folder at the specified path
	 */
	'post-create': {
		/** @description Create a file or folder on the filesystem */
		requestBody?: {
			content: {
				'application/json': external['models/CreateRequest.json'];
			};
		};
		responses: {
			/** @description OK */
			200: {
				content: {
					'application/json': external['models/Node.json'];
				};
			};
			/** @description Internal Server Error */
			500: never;
		};
	};
	/**
	 * Delete file
	 * @description Delete a file or folder from the filesystem
	 */
	'post-delete': {
		requestBody?: {
			content: {
				'application/json': external['models/PathRequest.json'];
			};
		};
		responses: {
			/** @description OK */
			200: never;
		};
	};
	/**
	 * Move file
	 * @description Move a file on the filesystem
	 */
	'post-move': {
		requestBody?: {
			content: {
				'application/json': {
					source: external['models/Path.json'];
					destination: external['models/Path.json'];
				};
			};
		};
		responses: {
			/** @description OK */
			200: {
				content: {
					'application/json': external['models/Node.json'];
				};
			};
		};
	};
	/**
	 * Copy file
	 * @description Move a file on the filesystem
	 */
	'post-copy': {
		requestBody?: {
			content: {
				'application/json': {
					source: external['models/Path.json'];
					destination: external['models/Path.json'];
				};
			};
		};
		responses: {
			/** @description OK */
			200: {
				content: {
					'application/json': external['models/Node.json'];
				};
			};
		};
	};
}
