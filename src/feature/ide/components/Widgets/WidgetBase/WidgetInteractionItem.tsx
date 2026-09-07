import React from "react";
import classNames from "classnames";

import { WidgetInteractionItemProps } from "@/feature/ide/components/Widgets/WidgetBase/WidgetBase.types";
import "./WidgetInteractionItem.scss";

const WidgetInteractionItem: React.FC<WidgetInteractionItemProps> = (
  properties,
) => {
  const Icon = properties.icon;

  return (
    <div
      className={classNames("c-widget-interaction-item", properties.className)}
      onClick={properties.onClick}
      title={properties.label}
    >
      <Icon />
    </div>
  );
};

export default WidgetInteractionItem;
