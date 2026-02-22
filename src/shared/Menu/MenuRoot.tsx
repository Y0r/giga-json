import React from "react";
import { Box } from "@chakra-ui/react";
import { Menu as MenuType } from "./menu.types";
import { MenuItem } from "./MenuItem";
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
export const MenuRoot: React.FC<MenuRootProps> = ({ className, menu }) => {
  const { orientation = "vertical", items } = menu;

  return (
    <Box
      className={classNames("c-menu", className)}
      display="flex"
      flexDirection={orientation === "horizontal" ? "row" : "column"}
      gap={orientation === "horizontal" ? 0 : 1}
    >
      {items.map((item, index) => (
        <MenuItem key={item.label || `sep-${index}`} item={item} />
      ))}
    </Box>
  );
};
