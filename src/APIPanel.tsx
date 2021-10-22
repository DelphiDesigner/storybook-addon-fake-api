import React, { useState } from "react";
import { AddonPanel } from "@storybook/components";
import { Args, ArgTypes, useChannel } from "@storybook/api";
import { EVENTS } from "./models/constants";
import { APIAccordion } from "./APIAccordion";
import { ApiManagerService } from "./service/api-manager.service";
import { UIService } from "./service/ui.service";

interface APIPanelProps {
  key: string;
  active: boolean;
}

export const APIPanel: React.FC<APIPanelProps> = (props) => {
  const apiManager = ApiManagerService.getInstance();
  const uiService = UIService.getInstance();

  const [args, setArgs] = useState<Args>();
  const [rows, setRows] = useState<ArgTypes>();

  const emit = useChannel({
    [EVENTS.API_SET]: (parameters) => {
      apiManager.setList(parameters);
      setArgs(uiService.getArgs());
      setRows(uiService.getRows());
    },
  });

  const paramChanged = (keyName: string, index: number, value: any) => {
    apiManager.updateItem(keyName, index, value);

    setArgs(uiService.getArgs());
    setRows(uiService.getRows());

    emit(EVENTS.API_ITEM_UPDATED, keyName, index, value);
  };

  return (
    <AddonPanel {...props}>
      <APIAccordion paramChanged={paramChanged} args={args} rows={rows} />
    </AddonPanel>
  );
};
