import React from "react";
import {
  VscCopy,
  VscFile,
  VscFolder,
  VscInsert,
  VscSaveAs,
  VscTrash,
} from "react-icons/vsc";

import { useFiles } from "@/feature/ide/hooks/useFiles";
import { useMenuSchema as useTabsMenuSchema } from "@/feature/ide/components/Menu/TabsMenu.schema";
import { useMenuSchema as useToolsWindowsMenuSchema } from "@/feature/ide/components/Menu/ToolsWindowsMenu.schema";

import { Menu } from "@/shared/Menu/state/menu.types";

/**
 * Menu schema for the main menu.
 */
export const useMenuSchema = (): Menu => {
  const { createEmptyFile, createFromFile, saveFileAs } = useFiles();
  const tabsMenuSchema = useTabsMenuSchema();
  const toolsWindowsMenuSchema = useToolsWindowsMenuSchema();

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
              onClick: saveFileAs,
            },
          },
          { type: "separator" as const },
          {
            label: "Clear storage",
            icon: <VscTrash />,
            action: {
              type: "callback" as const,
              onClick: () => {
                // @todo register event with notification.
                // @todo remove specific items from storage.
                // @todo inform user about success.
                window.localStorage.clear();
                location.reload();
              },
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
        label: "View",
        icon: null,
        items: [
          {
            label: "Tool Windows",
            icon: null,
            items: [...toolsWindowsMenuSchema.items],
          },
          {
            label: "Appearance",
            icon: null,
            items: [
              {
                label: "Status Bar",
                icon: null,
                action: {
                  type: "callback" as const,
                  // @todo toggle of bottom panel of dock system.
                  onClick: () => console.log("Show/Hide status bar"),
                },
              },
            ],
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
            items: [...tabsMenuSchema.items],
          },
        ],
      },
    ],
  };
};
