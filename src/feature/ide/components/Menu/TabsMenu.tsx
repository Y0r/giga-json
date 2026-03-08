import React, { ReactNode } from "react";
import { MenuFromContext, Menu } from "@/shared/Menu";
import { VscGithub } from "react-icons/vsc";

import { useTabs } from "@/feature/ide/hooks/useTabs";
import { EditorFile } from "@/feature/ide/state/ide.types";

interface TabsMenuProps {
  focusedTabId: EditorFile["id"];
  children: ReactNode;
}

/**
 * Menu schema for the tab's menu.
 */
export const getMenuSchema = (focusedTabId?: TabsMenuProps["focusedTabId"]) => {
  const {
    closeCurrentTab,
    closeOtherTabs,
    closeAllTabs,
    closeTabsToTheLeft,
    closeTabsToTheRight,
    reopenClosedTab,
  } = useTabs(focusedTabId);

  return {
    orientation: "vertical" as const,
    items: [
      {
        label: "Close",
        icon: null,
        action: {
          type: "callback" as const,
          onClick: closeCurrentTab,
        },
      },
      {
        label: "Close Other Tabs",
        icon: null,
        action: {
          type: "callback" as const,
          onClick: closeOtherTabs,
        },
      },
      {
        label: "Close All Tabs",
        icon: null,
        action: {
          type: "callback" as const,
          onClick: closeAllTabs,
        },
      },
      {
        label: "Close Tabs to the Left",
        icon: null,
        action: {
          type: "callback" as const,
          onClick: closeTabsToTheLeft,
        },
      },
      {
        label: "Close Tabs to the Right",
        icon: null,
        action: {
          type: "callback" as const,
          onClick: closeTabsToTheRight,
        },
      },
      { type: "separator" as const },
      {
        label: "Reopen Closed Tab",
        icon: null,
        action: {
          type: "callback" as const,
          onClick: reopenClosedTab,
        },
      },
      { type: "separator" as const },
      {
        label: "Rename file...",
        icon: null,
        action: {
          type: "callback" as const,
          onClick: () => console.log("rename file"),
        },
      },
      {
        label: "Create Gist...",
        icon: <VscGithub />,
        action: {
          type: "callback" as const,
          onClick: () => console.log("create gist"),
        },
      },
    ],
  };
};

export const TabsMenu = ({ focusedTabId, children }: TabsMenuProps) => {
  return (
    <MenuFromContext items={getMenuSchema(focusedTabId).items}>
      {children}
    </MenuFromContext>
  );
};
