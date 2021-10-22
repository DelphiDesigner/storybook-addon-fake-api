import { ArgTypes, Args } from "@storybook/components";
import { API_METHODS } from "../models/constants";
import { IAPIResponse, IAPI } from "../models/interfaces/api";
import { ApiManagerService } from "./api-manager.service";

export class UIService {
  private numberOfIndexDigits = 2;

  private readonly apiManager = ApiManagerService.getInstance();

  private static instance: UIService;

  public static getInstance(): UIService {
    if (!this.instance) {
      this.instance = new UIService();
    }
    return this.instance;
  }

  public getRows(): ArgTypes | null {
    const apiList = this.apiManager.getList();
    if (!apiList) {
      return null;
    }

    let result: ArgTypes = {};
    apiList.forEach((api: IAPI, index: number) => {
      const indexWithZeroPad = index
        .toString()
        .padStart(this.numberOfIndexDigits, "0");
      result = {
        ...result,
        [`enabled_${indexWithZeroPad}`]: {
          name: "Enabled",
          control: { type: "boolean" },
          table: {
            category: api.name,
          },
        },
        [`url_${indexWithZeroPad}`]: {
          name: "URL",
          control: { type: "text" },
          table: {
            category: api.name,
          },
        },
        [`method_${indexWithZeroPad}`]: {
          name: "Method",
          control: { type: "select" },
          options: API_METHODS,
          table: {
            category: api.name,
          },
        },
        ...this.getResponseControls(api.name, indexWithZeroPad),
      };
    });

    return result;
  }

  private getResponseControls(apiName: string, apiIndex: string) {
    const subcategory = `Response`;

    return {
      [`type_${apiIndex}`]: {
        name: "ResponseType",
        control: { type: "inline-radio" },
        options: ["Resolve", "Reject"],
        table: {
          category: apiName,
          subcategory,
        },
      },
      [`status_${apiIndex}`]: {
        name: "Status",
        control: { type: "number" },
        table: {
          category: apiName,
          subcategory,
        },
      },
      [`delay_${apiIndex}`]: {
        name: "Delay (ms)",
        control: { type: "number" },
        table: {
          category: apiName,
          subcategory,
        },
      },
      [`data_${apiIndex}`]: {
        name: "Data",
        control: { type: "object" },
        table: {
          category: apiName,
          subcategory,
        },
      },
    };
  }

  public getArgs(): Args | null {
    const apiList = this.apiManager.getList();
    if (!apiList) {
      return null;
    }

    let result: Args = {};
    apiList.forEach((api: IAPI, index: number) => {
      const indexWithZeroPad = index
        .toString()
        .padStart(this.numberOfIndexDigits, "0");
      result = {
        ...result,
        [`enabled_${indexWithZeroPad}`]:
          api.enabled === undefined ? true : api.enabled,
        [`url_${indexWithZeroPad}`]: api.url,
        [`method_${indexWithZeroPad}`]: api.method,
        ...this.getResponseArgs(api.response, indexWithZeroPad),
      };
    });
    return result;
  }

  private getResponseArgs(response: IAPIResponse, apiIndex: string) {
    return {
      [`data_${apiIndex}`]: response.data,
      [`status_${apiIndex}`]: response.status,
      [`delay_${apiIndex}`]: response.delay ? response.delay : 0,
      [`type_${apiIndex}`]: response.type,
    };
  }
}
