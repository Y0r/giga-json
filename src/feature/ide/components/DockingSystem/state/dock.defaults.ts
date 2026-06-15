import type { DockSettings } from "./dock.types";

/**
 * Default dock settings — the hardcoded initial layout.
 * Used as the initial state in the zustand store and
 * as the reset target for `resetSettings()`.
 */
export const DEFAULT_DOCK_SETTINGS: DockSettings = {
  groups: {
    left: {
      id: "left",
      position: "left",
      options: { collapsed: true },
    },
    right: {
      id: "right",
      position: "right",
      options: { collapsed: true },
    },
  },
  widgets: {
    tree: {
      id: "json-tree",
      component: "default",
      tabComponent: "default",
      groupId: "left",
      params: {
        title: "JSON Tree",
        description: "Shows the JSON data as a tree structure.",
        icon: "vsc-list-tree",
        isOpened: true,
      },
    },
    bookmarks: {
      id: "bookmarks",
      component: "default",
      tabComponent: "default",
      groupId: "left",
      params: {
        title: "Bookmarks",
        description: "A list of bookmarked lines.",
        icon: "vsc-bookmark",
      },
    },
    notifications: {
      id: "notifications",
      component: "default",
      tabComponent: "default",
      groupId: "right",
      params: {
        title: "Notifications",
        description: "A list of notifications from the IDE.",
        icon: "vsc-bell",
      },
    },
  },
};
