import { MockXhr, newMockXhr } from "mock-xmlhttprequest";
import { Method } from "../models/types";
import { ApiManagerService } from "./api-manager.service";

export class OverridingService {
  private static instance: OverridingService;

  public static getInstance(): OverridingService {
    if (!this.instance) {
      this.instance = new OverridingService();
    }
    return this.instance;
  }

  private constructor() {
    (window as any).originalFetch = window.fetch;
    window.fetch = this.fakeFetch;

    (window as any).originalXhr = window.XMLHttpRequest;
    window.XMLHttpRequest = newMockXhr() as any;
    (window.XMLHttpRequest as any as MockXhr).onSend = this.fakeXhr;
  }

  public fakeFetch = (
    input: string | Request,
    init: { method: Method }
  ): Promise<any> => {
    let apiMethod: Method;
    let apiUrl: string;

    if (typeof input === "string") {
      apiUrl = input;
      apiMethod = init?.method || 'GET';
    } else {
      apiUrl = input.url;
      apiMethod = input.method as Method;
    }

    const api = ApiManagerService.getInstance().getMatch(apiUrl, apiMethod);
    if (api && api.enabled) {
      return new Promise((res, rej) => {
        setTimeout(() => {
          const response = new Response(JSON.stringify(api.response.data));

          if (api.response.type === "Resolve") return res(response);
          return rej(response);
        }, api.response.delay || 0);
      });
    }
    return (global as any).originalFetch(input, init);
  };

  fakeXhr = (xhr: MockXhr) => {
    const apiMethod = (xhr as any).method as Method;
    const apiUrl = (xhr as any).url;

    const api = ApiManagerService.getInstance().getMatch(apiUrl, apiMethod);
    if (api && api.enabled) {
      setTimeout(() => {
        xhr.respond(api.response.status, {}, api.response.data);
      }, api.response.delay || 0);
    } else {
      // eslint-disable-next-line new-cap
      const realXhr = new (window as any).originalXhr();
      realXhr.open(apiMethod, apiUrl);
      realXhr.onreadystatechange = () => {
        if (realXhr.readyState === XMLHttpRequest.DONE) {
          xhr.respond(realXhr.status, {}, realXhr.responseText);
        }
      };
      realXhr.send();
    }
  };
}
