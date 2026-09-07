import React from "react";
import { useDockStore } from "@/feature/ide/components/DockingSystem/state/dock.store";
import { DockviewPanelApi } from "dockview-react";
import { MenuItem as MenuItemType } from "@/shared/Menu";
import { WidgetInteractionItemProps } from "@/feature/ide/components/Widgets/WidgetBase/WidgetBase.types";

/**
 * Hook to generate the common menu items for a dock widget.
 */
export const useWidgetMenu = (
  widgetId: string,
  panelApi: DockviewPanelApi,
  actions?: WidgetInteractionItemProps[],
) => {
  const widget = useDockStore((s) => s.settings.widgets[widgetId]);
  const moveWidget = useDockStore((s) => s.moveWidget);
  const changeGroupState = useDockStore((s) => s.changeGroupState);

  const handleMove = (targetGroup: "left" | "right") => {
    moveWidget(widgetId, targetGroup);
  };

  const handleHide = () => {
    if (widget) {
      changeGroupState(widget.groupId, { collapsed: true });
    }
  };

  const menuItems: MenuItemType[] = [
    {
      id: "hide",
      label: "Hide",
      action: {
        type: "callback" as const,
        onClick: handleHide,
      },
      weight: 10,
    },
    {
      id: "move-to",
      label: "Move to",
      items: [
        {
          label: "Left Sidebar",
          disabled: widget?.groupId === "left",
          action: {
            type: "callback" as const,
            onClick: () => handleMove("left"),
          },
        },
        {
          label: "Right Sidebar",
          disabled: widget?.groupId === "right",
          action: {
            type: "callback" as const,
            onClick: () => handleMove("right"),
          },
        },
      ],
      weight: 20,
    },
    ...(actions
      ? actions
          .toSorted((a, b) => (a.weight ?? 0) - (b.weight ?? 0))
          .map((item) => ({
            label: item.label,
            icon: item.icon ? React.createElement(item.icon) : undefined,
            action: {
              type: "callback" as const,
              onClick: item.onClick,
            },
            weight: item.weight ?? 50,
          }))
      : []),
    { type: "separator" as const, weight: 998 },
    {
      id: "remove",
      label: "Remove from sidebar",
      action: {
        type: "callback" as const,
        onClick: () => panelApi.close(),
      },
      weight: 999,
    },
  ];

  return menuItems;
};
