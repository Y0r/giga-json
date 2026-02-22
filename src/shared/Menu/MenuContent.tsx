import React from "react";
import { Menu, Portal } from "@chakra-ui/react";
import { MenuItem as MenuItemType } from "./menu.types";
import { MenuTrigger } from "./MenuTrigger";

interface MenuContentProps {
  /** The list of menu items to display within the content. */
  items: MenuItemType[];
}

/**
 * Recursively renders the contents of a menu or submenu.
 */
export const MenuContent: React.FC<MenuContentProps> = ({ items }) => {
  return (
    <Portal>
      <Menu.Positioner>
        <Menu.Content>
          {items.map((item, index) => {
            if (item.type === "separator") {
              return <Menu.Separator key={`sep-${index}`} />;
            }

            const hasSubmenu = item.items && item.items.length > 0;

            if (hasSubmenu) {
              return (
                <Menu.Root
                  key={`${item.label}-${index}`}
                  positioning={{
                    placement: "right-start",
                    gutter: 2,
                  }}
                >
                  <MenuTrigger item={item} isNested />
                  <MenuContent items={item.items!} />
                </Menu.Root>
              );
            }

            return (
              <MenuTrigger
                key={`${item.label}-${index}`}
                item={item}
                isNested
              />
            );
          })}
        </Menu.Content>
      </Menu.Positioner>
    </Portal>
  );
};
