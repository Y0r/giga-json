import React from "react";
import classNames from "classnames";

import { IDockviewPanelHeaderProps } from "dockview-react";
import { Icon } from "@chakra-ui/react";

import { useDockStore } from "@/feature/ide/components/DockingSystem/state/dock.store";

import type { DockTabParams } from "@/feature/ide/components/DockingSystem/state/dock.types";

/**
 * Panel tab component for the Panels.
 */
export const DockTab = (props: IDockviewPanelHeaderProps<DockTabParams>) => {
  const [isVisible, setIsVisible] = React.useState(props.api.isVisible);
  const widgetId = props.api.id;

  const widget = useDockStore((s) => s.settings.widgets[widgetId]);
  const isCollapsed = useDockStore((s) =>
    widget ? s.settings.groups[widget.groupId]?.options.collapsed : false,
  );

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const disposable = props.api.onDidVisibilityChange((event) => {
      setIsVisible(event.isVisible);
    });
    return () => {
      disposable.dispose();
    };
  }, [props.api]);

  // Handle draggability of the tab element itself.
  React.useEffect(() => {
    if (widget?.options?.draggable === false && ref.current) {
      let tabElement: HTMLElement | null = ref.current.parentElement;
      while (
        tabElement &&
        !tabElement.classList.contains("dv-tab") &&
        tabElement !== document.body
      ) {
        tabElement = tabElement.parentElement;
      }

      if (tabElement && tabElement.classList.contains("dv-tab")) {
        tabElement.draggable = false;
        // Also prevent dragstart event just in case.
        const onDragStart = (e: DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
        };
        tabElement.addEventListener("dragstart", onDragStart);
        return () => {
          tabElement.removeEventListener("dragstart", onDragStart);
        };
      }
    }
  }, [widget?.options?.draggable]);

  return (
    <div
      ref={ref}
      className={classNames("c-panel-tab", {
        "c-panel-tab__active": isVisible && !isCollapsed,
      })}
      title={`${props.params.title} - ${props.params.description}`}
    >
      <Icon size={"sm"}>{props.params.icon}</Icon>
    </div>
  );
};
