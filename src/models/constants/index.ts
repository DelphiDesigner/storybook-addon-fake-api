export const ADDON_ID = "storybook/fake-api";
export const PANEL_ID = `${ADDON_ID}/fake-api-panel`;
export const PANEL_TITLE = `Fake API List`;
export const PARAM_KEY = `fakeAPIParameter`;

export const EVENTS = {
  API_ITEM_UPDATED: `${ADDON_ID}/ADDONS_FAKE_API_UPDATE_DATA`,
  API_SET: `${ADDON_ID}/ADDONS_FAKE_API_SET_DATA`,
};

export const API_METHODS = [
  "CONNECT",
  "DELETE",
  "GET",
  "HEAD",
  "OPTIONS",
  "PATCH",
  "POST",
  "PUT",
  "TRACE",
];
