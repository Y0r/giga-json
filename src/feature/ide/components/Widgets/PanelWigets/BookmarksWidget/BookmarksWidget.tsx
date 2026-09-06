import React from "react";
import { IDockviewPanelProps } from "dockview-react";

import { Text } from "@chakra-ui/react";

import type { DockPanelParams } from "@/feature/ide/components/DockingSystem/state/dock.types";
import { DockPanel } from "@/feature/ide/components/DockingSystem/DockPanel";
import WidgetBase from "@/feature/ide/components/Widgets/WidgetBase/WidgetBase";
import { VscExpandAll, VscSearch } from "react-icons/vsc";

/**
 * Bookmarks widget — displays a list of bookmarked lines.
 */
export const BookmarksWidget = (
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
        toolbar={[
          {
            icon: VscExpandAll,
            label: "Expand All",
            onClick: () => {
              // @todo wire action.
              console.log("Expand all bookmarks");
            },
          },
        ]}
        actions={[
          {
            icon: VscSearch,
            label: "Search",
            onClick: () => {
              // @todo wire action.
              console.log("Start bookmarks search");
            },
            weight: 1,
          },
        ]}
      >
        <Text fontSize={"xs"}>{"Bookmarks widget content"}</Text>
      </WidgetBase>
    </DockPanel>
  );
};
