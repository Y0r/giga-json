import React from "react";
import { Menu } from "@/shared/Menu";
import {
  VscCopy,
  VscFile,
  VscFolder,
  VscInsert,
  VscSaveAs,
} from "react-icons/vsc";

import { useFiles } from "@/feature/ide/hooks/useFiles";
import { getMenuSchema as getTabsMenuSchema } from "@/feature/ide/components/Menu/TabsMenu";

/**
 * Menu schema for the main menu.
 */
export const getMenuSchema = () => {
  const { createEmptyFile, createFromFile } = useFiles();

  return {
    orientation: "horizontal" as const,
    items: [
      {
        label: "File",
        icon: null,
        items: [
          {
            label: "New File",
            icon: <VscFile />,
            action: {
              type: "callback" as const,
              onClick: createEmptyFile,
            },
          },
          {
            label: "Open",
            icon: <VscFolder />,
            action: {
              type: "callback" as const,
              onClick: createFromFile,
            },
          },
          { type: "separator" as const },
          {
            label: "Save as...",
            icon: <VscSaveAs />,
            action: {
              type: "callback" as const,
              onClick: () => console.log("Save as..."),
            },
          },
        ],
      },
      {
        label: "Edit",
        icon: null,
        items: [
          {
            label: "Copy",
            icon: <VscCopy />,
            shortcut: "Ctrl+C",
            action: {
              type: "callback" as const,
              onClick: () => console.log("Copy"),
            },
          },
          {
            label: "Paste",
            icon: <VscInsert />,
            action: {
              type: "callback" as const,
              onClick: () => console.log("Paste"),
            },
          },
        ],
      },
      {
        label: "Window",
        icon: null,
        items: [
          {
            label: "Editor Tabs",
            icon: null,
            items: [...getTabsMenuSchema().items],
          },
        ],
      },
    ],
  };
};

export const MainMenu = () => {
  return <Menu className={"c-main-menu"} menu={getMenuSchema()} />;
};
