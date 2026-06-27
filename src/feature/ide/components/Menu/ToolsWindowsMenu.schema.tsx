import { Menu } from "@/shared/Menu/state/menu.types";

/**
 * Menu schema for the tool windows.
 */
export const useMenuSchema = (): Menu => {
  // @todo build from widgets.
  return {
    orientation: "vertical" as const,
    items: [
      {
        label: "Hierarchy Tree",
        icon: null,
        action: {
          type: "callback" as const,
          onClick: () => {},
        },
      },
      {
        label: "Bookmarks",
        icon: null,
        action: {
          type: "callback" as const,
          onClick: () => {},
        },
      },
      {
        label: "Notifications",
        icon: null,
        action: {
          type: "callback" as const,
          onClick: () => {},
        },
      },
    ],
  };
};
