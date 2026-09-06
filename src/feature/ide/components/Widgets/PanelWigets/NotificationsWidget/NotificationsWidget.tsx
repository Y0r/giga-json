import React from "react";
import { IDockviewPanelProps } from "dockview-react";

import { Text } from "@chakra-ui/react";

import type { DockPanelParams } from "@/feature/ide/components/DockingSystem/state/dock.types";
import { DockPanel } from "@/feature/ide/components/DockingSystem/DockPanel";
import WidgetBase from "@/feature/ide/components/Widgets/WidgetBase/WidgetBase";

/**
 * Notifications widget — displays a list of notifications.
 */
export const NotificationsWidget = (
  props: IDockviewPanelProps<DockPanelParams>,
) => {
  return (
    <DockPanel
      title={props.params.title}
      description={props.params.description}
    >
      <WidgetBase
        id={props.api.id}
        title={props.params.title}
        panelApi={props.api}
      >
        <Text fontSize={"xs"}>{"Notifications widget content"}</Text>
      </WidgetBase>
    </DockPanel>
  );
};
