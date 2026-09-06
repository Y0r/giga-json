import React from "react";
import classnames from "classnames";

import { VscKebabVertical } from "react-icons/vsc";
import { useDockStore } from "@/feature/ide/components/DockingSystem/state/dock.store";
import { DockviewPanelApi } from "dockview-react";
import { WidgetInteractionItemProps } from "./WidgetBase.types";
import { Menu as SharedMenu, MenuItem as MenuItemType } from "@/shared/Menu";

interface WidgetContextualMenuProps {
  widgetId: string;
  panelApi: DockviewPanelApi;
  actions?: WidgetInteractionItemProps[];
}

export const WidgetContextualMenu: React.FC<WidgetContextualMenuProps> = ({
  widgetId,
  panelApi,
  actions,
}) => {
  const widget = useDockStore((s) => s.settings.widgets[widgetId]);
  const moveWidget = useDockStore((s) => s.moveWidget);
  const handleMove = (targetGroup: "left" | "right") => {
    moveWidget(widgetId, targetGroup);
  };

  const menuItems: MenuItemType[] = [
    {
      label: "Move widget to",
      items: [
        {
          label: "Left",
          disabled: widget?.groupId === "left",
          action: {
            type: "callback" as const,
            onClick: () => handleMove("left"),
          },
        },
        {
          label: "Right",
          disabled: widget?.groupId === "right",
          action: {
            type: "callback" as const,
            onClick: () => handleMove("right"),
          },
        },
      ],
      weight: 99,
    },
    { type: "separator" as const, weight: 998 },
    {
      label: "Remove from Sidebar",
      action: {
        type: "callback" as const,
        onClick: () => panelApi.close(),
      },
      weight: 999,
    },
    ...(actions
      ? actions
          .toSorted((a, b) => (a.weight ?? 0) - (b.weight ?? 0))
          .map((item) => ({
            label: item.label,
            icon: item.icon ? <item.icon /> : undefined,
            action: {
              type: "callback" as const,
              onClick: item.onClick,
            },
          }))
      : []),
  ];

  return (
    <SharedMenu
      className={classnames([
        "c-widget-interaction-item",
        "c-widget-interaction-item__contextual",
      ])}
      menu={{
        orientation: "horizontal",
        items: [
          {
            icon: <VscKebabVertical />,
            items: menuItems,
          },
        ],
      }}
    />
  );
};

export default WidgetContextualMenu;
