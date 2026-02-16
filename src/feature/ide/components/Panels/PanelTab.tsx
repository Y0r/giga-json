import React from "react";
import classNames from "classnames";

import { IDockviewPanelHeaderProps } from "dockview-react";
import { Icon } from "@chakra-ui/react";

interface PanelTabProps {
  className: string;
  icon: string;
  iconColor: string;
  isOpen: boolean;
}

/**
 * Panel tab component for the Panels.
 */
export const PanelTab = (props: IDockviewPanelHeaderProps<PanelTabProps>) => {
  return (
    <div
      className={classNames(props.params.className, "c-panel-tab", {
        "c-panel-tab__active": props.params.isOpen,
      })}
    >
      <Icon size={"sm"} color={props.params.iconColor}>
        {props.params.icon}
      </Icon>
    </div>
  );
};
