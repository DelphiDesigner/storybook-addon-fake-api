import { match } from "path-to-regexp";
import { Method } from "../models/types";
import { IAPIResponse, IAPI, IAPIList } from "../models/interfaces/api";

export class ApiManagerService {
  private apiList: IAPIList;

  private static instance: ApiManagerService;

  public static getInstance(): ApiManagerService {
    if (!this.instance) {
      this.instance = new ApiManagerService();
    }
    return this.instance;
  }

  public setList = (list: IAPIList): boolean => {
    if (this.validateList(list)) {
      this.apiList = list;
      return true;
    }
    return false;
  };

  public getList = (): IAPIList => {
    return this.apiList;
  };

  private validateList = (ApiList: IAPIList): boolean => {
    if (!ApiList) {
      return false;
    }
    if (!Array.isArray(ApiList) || ApiList.length === 0) {
      return false;
    }

    const invalidItem = ApiList.find(
      (api: IAPI, index: number) => !this.validateAPIItem(api, index)
    );

    if (invalidItem) {
      return false;
    }

    return true;
  };

  private validateAPIItem = (api: IAPI, index: number): boolean => {
    if (!api) {
      console.error(`API #${index + 1} is falsy`);
      return false;
    }
    if (!api.method) {
      console.error(`API #${index + 1} doesn't have a valid method`);
      return false;
    }

    if (!api.url) {
      console.error(`API #${index + 1} doesn't have any url`);
      return false;
    }
    if (!this.validateResponse(api.response, index)) {
      return false;
    }
    return true;
  };

  private validateResponse = (
    response: IAPIResponse,
    index: number
  ): boolean => {
    if (!response) {
      console.error(`API #${index + 1} doesn't have any responses`);
      return false;
    }

    if (!response.data) {
      console.error(`API #${index + 1} doesn't have any responses data`);
      return false;
    }

    if (!response.status) {
      console.error(`API #${index + 1} doesn't have any responses status`);
      return false;
    }

    if (!response.type) {
      console.error(`API #${index + 1} doesn't have any responses type`);
      return false;
    }
    return true;
  };

  public updateItem = (
    keyName: string,
    index: number,
    value: any
  ): IAPIList => {
    const newList = [...this.apiList];
    if (
      keyName === "name" ||
      keyName === "url" ||
      keyName === "enabled" ||
      keyName === "method"
    ) {
      (newList[index] as any)[keyName] = value;
      return newList;
    }

    if (
      keyName === "delay" ||
      keyName === "data" ||
      keyName === "status" ||
      keyName === "type"
    ) {
      (newList[index].response as any)[keyName] = value;
      return newList;
    }

    return null;
  };

  public getMatch = (url: string, method: Method): IAPI | undefined => {
    if (!this.apiList) {
      return undefined;
    }
    let passedUrl = url;
    return this.apiList.find((api) => {
      if (url.indexOf("http") !== 0) {
        passedUrl = `${window.location.protocol}//${window.location.host}${url}`;
      }
      const parsedApiUrl = new URL(api.url);
      const parsedUrl = new URL(passedUrl);

      const matcher = match(parsedApiUrl.host + parsedApiUrl.pathname, {
        encode: encodeURI,
        decode: decodeURIComponent,
      });
      const matched = matcher(parsedUrl.host + parsedUrl.pathname);

      return (
        matched && method.toUpperCase() === api.method.toUpperCase() && api
      );
    });
  };
}
