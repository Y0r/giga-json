import React, { ReactNode } from "react";

import { Menu } from "@chakra-ui/react";
import { MenuContent } from "@/shared/Menu";
import { MenuItem as MenuItemType } from "@/shared/Menu/state/menu.types";

interface ContextMenuProps {
  /** The children that will trigger the context menu on right-click. */
  children: ReactNode;
  /** The menu items to display. */
  items: MenuItemType[];
}

/**
 * A component that wraps an element and triggers a context menu on right-click.
 */
export const MenuFromContext: React.FC<ContextMenuProps> = ({
  children,
  items,
}) => {
  return (
    <Menu.Root positioning={{ placement: "bottom-start" }}>
      <Menu.ContextTrigger asChild>{children}</Menu.ContextTrigger>
      <MenuContent items={items} />
    </Menu.Root>
  );
};
