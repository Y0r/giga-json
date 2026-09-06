import React from "react";
import { IconType } from "react-icons";
import { DockviewPanelApi } from "dockview-react";

export type WidgetInteractionItemProps = {
  icon: IconType;
  label: string;
  onClick: () => void;
  className?: string;
  weight?: number;
};

type WidgetToolbar = WidgetInteractionItemProps[];

type WidgetActions = WidgetInteractionItemProps[];

export interface WidgetBaseProps {
  id: string;
  title: string;
  toolbar?: WidgetToolbar;
  actions?: WidgetActions;
  children: React.ReactNode;
  panelApi: DockviewPanelApi;
  classOverrides?: {
    widgetClassname?: string;
    headerClassname?: string;
    bodyClassname?: string;
  };
}
