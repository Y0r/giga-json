import React from "react";
import { IDockviewPanelProps } from "dockview-react";

import { Text } from "@chakra-ui/react";

import type { DockPanelParams } from "@/feature/ide/components/DockingSystem/state/dock.types";
import { DockPanel } from "@/feature/ide/components/DockingSystem/DockPanel";
import { useDockStore } from "@/feature/ide/components/DockingSystem/state/dock.store";
import WidgetBase from "@/feature/ide/components/Widgets/WidgetBase/WidgetBase";

/**
 * Tree widget — shows the JSON data as a tree structure.
 */
export const TreeWidget = (props: IDockviewPanelProps<DockPanelParams>) => {
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
        <Text fontSize={"xs"}>{"Tree widget content"}</Text>
      </WidgetBase>
    </DockPanel>
  );
};
