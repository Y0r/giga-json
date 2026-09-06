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
      weight: 10,
    },
    right: {
      id: "right",
      position: "right",
      options: { collapsed: true },
      weight: 20,
    },
  },
  widgets: {
    tree: {
      id: "tree",
      component: "tree",
      tabComponent: "default",
      groupId: "left",
      params: {
        title: "JSON Tree",
        description: "Shows the JSON data as a tree structure.",
        icon: "vsc-list-tree",
      },
      weight: 10,
    },
    bookmarks: {
      id: "bookmarks",
      component: "bookmarks",
      tabComponent: "default",
      groupId: "left",
      params: {
        title: "Bookmarks",
        description: "A list of bookmarked lines.",
        icon: "vsc-bookmark",
      },
      weight: 20,
    },
    notifications: {
      id: "notifications",
      component: "notifications",
      tabComponent: "default",
      groupId: "right",
      params: {
        title: "Notifications",
        description: "A list of notifications from the IDE.",
        icon: "vsc-bell",
      },
      weight: 10,
    },
  },
};
