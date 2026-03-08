import React from "react";

import { Menu } from "@chakra-ui/react";
import { MenuTrigger, MenuContent } from "@/shared/Menu";
import { MenuItem as MenuItemType } from "@/shared/Menu/state/menu.types";

interface MenuItemProps {
  /** The menu item configuration. */
  item: MenuItemType;
}

/**
 * Handles the logic for a single menu item.
 * Determines if it's a separator, a simple item, or a nested submenu.
 */
export const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  if (item.type === "separator") {
    return <Menu.Separator />;
  }

  const hasSubmenu = item.items && item.items.length > 0;

  // If an item has no submenu, render a simple menu trigger with action.
  if (!hasSubmenu) {
    return <MenuTrigger item={item} />;
  }

  // If item has submenu, render Chakra's Menu component
  return (
    <Menu.Root
      positioning={{
        strategy: "fixed",
        placement: "bottom-start",
      }}
    >
      <MenuTrigger item={item} />
      <MenuContent items={item.items!} />
    </Menu.Root>
  );
};
