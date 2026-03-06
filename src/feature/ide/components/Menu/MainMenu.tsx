import React from "react";
import { MenuRoot } from "@/shared/Menu";
import {
  VscCopy,
  VscFile,
  VscFolder,
  VscInsert,
  VscSaveAs,
} from "react-icons/vsc";

import { useFiles } from "@/feature/ide/hooks/useFiles";

export const MainMenu = () => {
  const { createEmptyFile, createFromFile } = useFiles();

  const mainMenu = {
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
    ],
  };

  return <MenuRoot className={"c-main-menu"} menu={mainMenu} />;
};
