import React from "react";
import classNames from "classnames";

import { IDockviewPanelHeaderProps } from "dockview-react";
import { Icon } from "@chakra-ui/react";

import type { DockTabParams } from "@/feature/ide/components/DockingSystem/state/dock.types";

/**
 * Panel tab component for the Panels.
 */
export const DockTab = (props: IDockviewPanelHeaderProps<DockTabParams>) => {
  // @todo remove console.log;
  // console.log("DockTab params", props.params);

  return (
    <div
      className={classNames("c-panel-tab", {
        "c-panel-tab__active": props.params.isOpened,
      })}
      title={`${props.params.title} - ${props.params.description}`}
    >
      <Icon size={"sm"}>{props.params.icon}</Icon>
    </div>
  );
};
