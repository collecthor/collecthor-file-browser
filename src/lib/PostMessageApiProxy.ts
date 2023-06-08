import type { external } from "$lib/interfaces/api.generated.d.ts";

import { FetchApiClient } from "$lib/FetchApiClient";
type CreateRequest = external["models/CreateRequest.json"];
type Path = external["models/Path.json"];

/**
 * This proxy listens on the given port and forwards requests to the client.
 *
 */
export default class PostMessageApiProxy {
  constructor(port: MessagePort, baseUrl?: string) {
    const client = new FetchApiClient(baseUrl);
    port.onmessage = async (
      ev: MessageEvent<{
        port: MessagePort;
        method: "createFile" | "deleteFile" | "viewPath" | "getUrl";
        path: Path | null;
        createRequest: null | CreateRequest;
      }>
    ) => {
      if (ev.data.method === "createFile" && ev.data.createRequest != null) {
        try {
          const data = await client.createFile(ev.data.createRequest);
          ev.data.port.postMessage({ data });
        } catch (error) {
          ev.data.port.postMessage({ error });
        }
      } else if (ev.data.method !== "createFile" && ev.data.path != null) {
        try {
          const data = await client[ev.data.method](ev.data.path);
          ev.data.port.postMessage({ data });
        } catch (error) {
          ev.data.port.postMessage({ error });
        }
      }
    };
  }
}
