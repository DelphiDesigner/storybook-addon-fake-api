import { Args, ArgsTable, ArgTypes } from "@storybook/components";
import React from "react";

interface APIAccordionProps {
  paramChanged: Function;
  args: Args;
  rows: ArgTypes;
}
export const APIAccordion: React.FC<APIAccordionProps> = (
  props: APIAccordionProps
) => {
  const { rows, args, paramChanged } = props;
  return (
    <>
      <ArgsTable
        rows={rows}
        args={args}
        inAddonPanel
        compact
        updateArgs={(arg) => {
          Object.entries(arg).forEach(([key, value]) => {
            const keyParts = key.split("_");
            paramChanged(keyParts[0], parseInt(keyParts[1], 10), value);
          });
        }}
      />
    </>
  );
};
