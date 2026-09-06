import React from "react";
import { Flex } from "@chakra-ui/react";
import classNames from "classnames";

import { Text } from "@chakra-ui/react";

import type { WidgetBaseProps } from "./WidgetBase.types";
import WidgetInteractionItem from "@/feature/ide/components/Widgets/WidgetBase/WidgetInteractionItem";
import { VscChromeMinimize } from "react-icons/vsc";
import { useDockStore } from "@/feature/ide/components/DockingSystem/state/dock.store";
import WidgetContextualMenu from "./WidgetContextualMenu";

import "./WidgetBase.scss";

export const WidgetBase: React.FC<WidgetBaseProps> = (properties) => {
  const widgetId = properties.id;
  const widget = useDockStore((s) => s.settings.widgets[widgetId]);
  const changeGroupState = useDockStore((s) => s.changeGroupState);

  const handleHide = () => {
    if (widget) {
      changeGroupState(widget.groupId, { collapsed: true });
    }
  };

  return (
    <div
      id={properties.id}
      className={classNames(
        "c-dock-widget",
        properties.classOverrides?.widgetClassname,
      )}
    >
      <Flex
        direction={"row"}
        justify={"space-between"}
        alignItems={"center"}
        gap={1}
        wrap={"nowrap"}
        className={classNames(
          "c-dock-widget__header",
          properties.classOverrides?.headerClassname,
        )}
      >
        <Text className={"c-dock-widget__title"} fontSize={"xs"}>
          {properties.title}
        </Text>

        <Flex className={"c-dock-widget__interaction-items"}>
          {properties.toolbar &&
            properties.toolbar
              .toSorted((a, b) => (a.weight ?? 0) - (b.weight ?? 0))
              .map((item, index) => (
                <WidgetInteractionItem
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  onClick={item.onClick}
                />
              ))}

          <WidgetContextualMenu
            widgetId={widgetId}
            panelApi={properties.panelApi}
            actions={properties.actions}
          />

          <WidgetInteractionItem
            icon={VscChromeMinimize}
            label={"Hide"}
            onClick={handleHide}
            className={"c-dock-widget__interaction-item__hide"}
          />
        </Flex>
      </Flex>

      <div
        className={classNames(
          "c-dock-widget__body",
          properties.classOverrides?.bodyClassname,
        )}
      >
        {properties.children}
      </div>
    </div>
  );
};

export default WidgetBase;
