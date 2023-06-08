import type { external, operations } from "$lib/interfaces/api.generated.d.ts";

import type ApiClient from "$lib/interfaces/ApiClient";

import type { FetchRequest } from "$lib/PostMessageApiProxy";
type CreateRequest = external["models/CreateRequest.json"];
type Path = external["models/Path.json"];

/**
 * This postmessage client does not do any type checking.
 */
export default class PostMessageApiClient implements ApiClient {
  private port: MessagePort;
  constructor(port: MessagePort) {
    this.port = port;
  }

  private createPromise<T>(
    method: string,
    arg: Path | CreateRequest
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (e: MessageEvent) => {
        channel.port1.close();
        const { error, data } = e.data;
        console.log("Received message from proxy:", e.data)
        if (data != null) {
          resolve(data);
        }
        reject(error);
      };
      this.port.postMessage(
        <FetchRequest>{
          method: method,
          arg: arg,
          port: channel.port2,
        },
        [channel.port2]
      );
    });
  }

  public async createFile(
    file: CreateRequest
  ): Promise<
    operations["post-create"]["responses"]["200"]["content"]["application/json"]
  > {
    return this.createPromise("createFile", file);
  }

  public async viewPath(
    path: Path
  ): Promise<
    operations["post-view"]["responses"]["200"]["content"]["application/json"]
  > {
    return this.createPromise("viewPath", path);
  }

  public async getUrl(
    path: Path
  ): Promise<
    operations["post-url"]["responses"]["200"]["content"]["application/json"]
  > {
    return this.createPromise("getUrl", path);
  }

  public async deleteFile(path: Path): Promise<void> {
    return this.createPromise("deleteFile", path);
  }
}
