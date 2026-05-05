import React from "react";
import { IDockviewPanelProps } from "dockview-react";

interface PanelProps {}

/**
 * Panel base component for the Panels.
 */
export const Panel = (_props: IDockviewPanelProps<PanelProps>) => {
  return <div>Panel</div>;
};
