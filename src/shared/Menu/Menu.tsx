import React from "react";

import { Box } from "@chakra-ui/react";
import { MenuItem } from "@/shared/Menu";
import { Menu as MenuType } from "@/shared/Menu/state/menu.types";

import classNames from "classnames";

interface MenuRootProps {
  /** Optional class name for the menu container. */
  className?: string;
  /** The menu configuration object. */
  menu: MenuType;
}

/**
 * The root component for the menu system.
 * Handles the overall layout (horizontal or vertical) and iterates through items.
 */
export const Menu: React.FC<MenuRootProps> = ({ className, menu }) => {
  const { orientation = "vertical", items } = menu;

  return (
    <Box
      className={classNames("c-menu", className)}
      display="flex"
      flexDirection={orientation === "horizontal" ? "row" : "column"}
      gap={orientation === "horizontal" ? 0 : 1}
    >
      {items
        .toSorted((a, b) => (a.weight ?? 0) - (b.weight ?? 0))
        .map((item, index) => (
          <MenuItem key={item.label || `sep-${index}`} item={item} />
        ))}
    </Box>
  );
};
