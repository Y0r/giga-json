import React from "react";
import classnames from "classnames";

import { VscKebabVertical } from "react-icons/vsc";
import { useWidgetMenu } from "@/feature/ide/components/DockingSystem/hooks/useWidgetMenu";
import { DockviewPanelApi } from "dockview-react";
import { WidgetInteractionItemProps } from "./WidgetBase.types";
import { Menu as SharedMenu } from "@/shared/Menu";

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
  const menuItems = useWidgetMenu(widgetId, panelApi, actions).filter(
    (item) => item.id !== "hide",
  );

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
