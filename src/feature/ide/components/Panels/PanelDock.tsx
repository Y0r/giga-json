import React from "react";
import { DockviewReact, DockviewReadyEvent } from "dockview-react";

import { Panel } from "@/feature/ide/components/Panels/Panel";
import { PanelTab } from "@/feature/ide/components/Panels/PanelTab";

import "dockview/dist/styles/dockview.css";

/**
 * Panels dock component for the IDE.
 */
export const PanelDock = () => {
  // Create initial panels.
  const onReady = (event: DockviewReadyEvent) => {
    event.api.addPanel({
      id: "panel_1",
      component: "default",
      tabComponent: "default",
      params: {
        icon: null,
        isOpened: true,
      },
    });

    event.api.addPanel({
      id: "panel_2",
      component: "default",
      tabComponent: "default",
      params: {
        icon: null,
        isOpened: false,
      },
    });
  };

  return (
    <DockviewReact
      className={"dockview-theme-abyss"}
      components={{ default: Panel }}
      tabComponents={{ default: PanelTab }}
      onReady={onReady}
    />
  );
};
