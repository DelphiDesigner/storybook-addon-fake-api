import { MakeDecoratorResult } from "@storybook/addons";

export type Method =
  | "CONNECT"
  | "DELETE"
  | "GET"
  | "HEAD"
  | "OPTIONS"
  | "PATCH"
  | "POST"
  | "PUT"
  | "TRACE";

export type ResponseType = "Resolve" | "Reject";

export interface IAPI {
  enabled?: boolean;
  name: string;
  url: string;
  method: Method;
  response: IAPIResponse;
}

export interface IAPIResponse {
  status: number;
  data: Object | Array<any>;
  delay?: number;
  type: ResponseType;
}

export type IAPIList = Array<IAPI>;

export type withAPI = MakeDecoratorResult;
