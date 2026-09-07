import React from "react";

type DockPanelProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

/**
 * Shared panel wrapper — provides the structural c-panel container.
 * Each widget composes this and adds its own WidgetBase / content inside.
 */
export const DockPanel: React.FC<DockPanelProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="c-panel" title={`${title} - ${description}`}>
      {children}
    </div>
  );
};
