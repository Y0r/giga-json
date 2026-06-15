import React from "react";
import {
  DockviewReact,
  DockviewReadyEvent,
  DockviewTheme,
} from "dockview-react";

import { DockPanel } from "@/feature/ide/components/DockingSystem/DockPanel";
import { DockTab } from "@/feature/ide/components/DockingSystem/DockTab";
import { useDockStore } from "@/feature/ide/components/DockingSystem/state/dock.store";
import { resolveDockIcon } from "@/feature/ide/components/DockingSystem/state/dock.icons";

import "dockview/dist/styles/dockview.css";
import "./theme/ThemeDark.scss";

type DockProps = {
  children?: React.ReactNode;
};

/**
 * Dock component for the IDE.
 */
export const Dock: React.FC<DockProps> = ({ children }) => {
  // Create initial panels from store settings.
  const onReady = (event: DockviewReadyEvent) => {
    const { settings } = useDockStore.getState();

    // Add edge groups.
    Object.values(settings.groups).forEach((group) => {
      event.api.addEdgeGroup(group.position, {
        id: group.id,
        ...group.options,
      });
    });

    // Add widgets as panels.
    Object.values(settings.widgets).forEach((widget) => {
      event.api.addPanel({
        id: widget.id,
        component: widget.component,
        tabComponent: widget.tabComponent,
        position: { referenceGroup: widget.groupId },
        params: {
          ...widget.params,
          // Resolve icon string key to ReactNode for the tab component.
          icon: resolveDockIcon(widget.params.icon),
        },
      });
    });
  };

  const WatermarkComponent = React.useCallback(
    () => <>{children}</>,
    [children],
  );

  const theme: DockviewTheme = {
    name: "gson-dark",
    className: "dockview-gson-dark",
    colorScheme: "dark",
  };

  return (
    <DockviewReact
      theme={theme}
      onReady={onReady}
      components={{ default: DockPanel }}
      tabComponents={{ default: DockTab }}
      watermarkComponent={WatermarkComponent}
    />
  );
};
