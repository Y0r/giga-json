import React from "react";
import {
  DockviewApi,
  DockviewReact,
  DockviewReadyEvent,
  DockviewTheme,
} from "dockview-react";

import { DockTab } from "@/feature/ide/components/DockingSystem/DockTab";
import { useDockStore } from "@/feature/ide/components/DockingSystem/state/dock.store";
import { DEFAULT_DOCK_SETTINGS } from "@/feature/ide/components/DockingSystem/state/dock.defaults";
import { resolveDockIcon } from "@/feature/ide/components/DockingSystem/state/dock.icons";

import "dockview/dist/styles/dockview.css";
import "./theme/ThemeDark.scss";

type DockProps = {
  children?: React.ReactNode;
  components: Record<string, React.ComponentType<any>>;
};

/**
 * Dock component for the IDE.
 */
export const Dock: React.FC<DockProps> = ({ children, components }) => {
  const [api, setApi] = React.useState<DockviewApi>();
  const settings = useDockStore((state) => state.settings);

  // Create initial panels from store settings.
  const onReady = (event: DockviewReadyEvent) => {
    const { settings: initialSettings } = useDockStore.getState();

    // Add locking logic to restrict panel movement.
    event.api.onWillDrop((e) => {
      const { settings } = useDockStore.getState();

      // Handle panel draggability.
      if (e.kind === "panel") {
        const widgetId = e.panelId;
        const widget = settings.widgets[widgetId];
        if (widget?.options?.draggable === false) {
          e.preventDefault();
          return;
        }
      }

      const targetGroup = e.group;
      if (targetGroup) {
        const location = targetGroup.api.location;

        // Prevent dropping into non-edge regions (e.g. center/grid).
        if (location.type !== "edge") {
          e.preventDefault();
          return;
        }

        const isSide =
          location.type === "edge" &&
          (location.position === "left" || location.position === "right");

        // Prevent creating top/bottom splits in side regions.
        if (isSide && (e.position === "top" || e.position === "bottom")) {
          e.preventDefault();
          return;
        }

        // Prevent dropping into locked groups from settings.
        const targetGroupSettings = settings.groups[targetGroup.id];
        if (
          targetGroupSettings?.options.locked === "no-drop" ||
          targetGroupSettings?.options.locked === true
        ) {
          e.preventDefault();
          return;
        }
      } else {
        // Prevent creating new groups at top, bottom or center.
        if (
          e.position === "top" ||
          e.position === "bottom" ||
          e.position === "center"
        ) {
          e.preventDefault();
          return;
        }
      }
    });

    // Add edge groups.
    Object.values(initialSettings.groups)
      .filter(
        (group) => group.position === "left" || group.position === "right",
      )
      .toSorted((a, b) => (a.weight ?? 0) - (b.weight ?? 0))
      .forEach((group) => {
        const edgeGroupApi = event.api.addEdgeGroup(group.position, {
          id: group.id,
          ...group.options,
        } as any);

        edgeGroupApi.onDidCollapsedChange((e) => {
          useDockStore.getState().changeGroupState(group.id, {
            collapsed: e.isCollapsed,
          });
        });
      });

    // Add widgets as panels.
    Object.values(initialSettings.widgets)
      .filter((widget) => components[widget.component])
      .toSorted((a, b) => (a.weight ?? 0) - (b.weight ?? 0))
      .forEach((widget) => {
        let referenceGroup = widget.groupId;

        // Fallback if the group doesn't exist or is invalid (e.g. stale 'bottom' group from previous session)
        const group = initialSettings.groups[referenceGroup];
        if (
          !group ||
          (group.position !== "left" && group.position !== "right")
        ) {
          referenceGroup =
            DEFAULT_DOCK_SETTINGS.widgets[widget.id]?.groupId ??
            Object.keys(initialSettings.groups).find(
              (id) =>
                initialSettings.groups[id].position === "left" ||
                initialSettings.groups[id].position === "right",
            ) ??
            "left";

          // Update the store to fix the corrupted state
          setTimeout(() => {
            useDockStore.getState().moveWidget(widget.id, referenceGroup);
          }, 0);
        }

        const panel = event.api.addPanel({
          id: widget.id,
          component: widget.component,
          tabComponent: widget.tabComponent,
          position: { referenceGroup },
          minimumWidth: 200,
          params: {
            ...widget.params,
            // Resolve icon string key to ReactNode for the tab component.
            icon: resolveDockIcon(widget.params.icon),
          },
        });

        panel.api.onDidGroupChange(() => {
          const currentGroupId =
            useDockStore.getState().settings.widgets[widget.id]?.groupId;
          const newGroupId = panel.group.id;
          if (newGroupId && currentGroupId !== newGroupId) {
            useDockStore.getState().moveWidget(widget.id, newGroupId);
          }
        });
      });

    setApi(event.api);
  };

  React.useEffect(() => {
    if (!api) return;

    // Sync group collapsed state
    Object.values(settings.groups).forEach((group) => {
      const edgeGroupApi = api.getEdgeGroup(group.position);
      if (edgeGroupApi) {
        const isCurrentlyCollapsed = edgeGroupApi.isCollapsed();
        if (group.options.collapsed && !isCurrentlyCollapsed) {
          edgeGroupApi.collapse();
        } else if (!group.options.collapsed && isCurrentlyCollapsed) {
          edgeGroupApi.expand();
        }
      }
    });

    // Sync widget state
    Object.values(settings.widgets).forEach((widget) => {
      const panel = api.getPanel(widget.id);
      if (panel) {
        // Sync position (move to a different group if needed)
        if (panel.group && panel.group.id !== widget.groupId) {
          const targetGroup = api.getGroup(widget.groupId);
          if (targetGroup) {
            panel.api.moveTo({ group: targetGroup as any });
          }
        }
      }
    });
  }, [api, settings]);

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
      components={components}
      tabComponents={{ default: DockTab }}
      watermarkComponent={WatermarkComponent}
    />
  );
};
