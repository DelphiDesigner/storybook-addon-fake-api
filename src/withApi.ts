/* eslint-disable no-console */
import addons, { makeDecorator } from "@storybook/addons";
import { IAPIList } from "./models/interfaces/api";
import { EVENTS } from "./models/constants";
import { OverridingService } from "./service/overriding.service";
import { ApiManagerService } from "./service/api-manager.service";

export const withAPI = makeDecorator({
  name: "withAPI",
  parameterName: "APIList",
  wrapper: (storyFn, context, { parameters }) => {
    OverridingService.getInstance();
    ApiManagerService.getInstance().setList(parameters as IAPIList);

    const channel = addons.getChannel();

    channel.emit(EVENTS.API_SET, parameters as IAPIList);

    channel.on(EVENTS.API_ITEM_UPDATED, (keyName, index, value) => {
      ApiManagerService.getInstance().updateItem(keyName, index, value);
    });

    return storyFn(context);
  },
});
