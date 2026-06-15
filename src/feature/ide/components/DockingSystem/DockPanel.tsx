import React from "react";
import { IDockviewPanelProps } from "dockview-react";
import { Text } from "@chakra-ui/react";
import classNames from "classnames";

import type { DockPanelParams } from "@/feature/ide/components/DockingSystem/state/dock.types";

/**
 * Panel base component for the Panels.
 */
export const DockPanel = (props: IDockviewPanelProps<DockPanelParams>) => {
  // @todo remove console.log;
  // console.log("DockPanel props", props);

  return (
    <div
      className={classNames("c-panel", {
        "c-panel__active": props.params.isOpened,
      })}
      title={`${props.params.title} - ${props.params.description}`}
    >
      <div className="c-panel-header">
        <Text>{props.params.title}</Text>
        {/* https://chakra-ui.com/docs/components/toggle-tip */}
      </div>
      <div className="c-panel-content"></div>
    </div>
  );
};
