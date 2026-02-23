import React from "react";
import { MenuItem as MenuItemType } from "./menu.types";
import { MenuTrigger } from "./MenuTrigger";
import { MenuContent } from "./MenuContent";
import { Menu } from "@chakra-ui/react";

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
