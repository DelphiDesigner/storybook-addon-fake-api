import { Method, ResponseType } from "../types";

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
