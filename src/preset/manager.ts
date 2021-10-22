import { addons, types } from "@storybook/addons";
import { ADDON_ID, PANEL_ID } from "../models/constants";
import { APIPanel } from "../APIPanel";

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "Fake API",
    match: ({ viewMode }) => viewMode === "story",
    render: APIPanel,
  });
});
