import React from "react";
import { Button, Menu } from "@chakra-ui/react";
import { MenuItem as MenuItemType } from "./menu.types";
import classNames from "classnames";
import { LuChevronRight } from "react-icons/lu";

interface MenuTriggerProps {
  /** The menu item configuration. */
  item: MenuItemType;
  /** Whether the trigger is part of a nested menu. Defaults to false. */
  isNested?: boolean;
}

/**
 * Renders the actual clickable UI element for a menu item.
 * Supports different styles for top-level menu bar buttons and nested menu items.
 */
export const MenuTrigger: React.FC<MenuTriggerProps> = ({
  item,
  isNested = false,
}) => {
  const {
    label,
    icon,
    iconPosition = "before",
    action,
    disabled,
    items,
  } = item;
  const hasSubmenu = items && items.length > 0;

  const handleClick = () => {
    if (disabled) return;

    if (action?.type === "callback") {
      action.onClick();
    } else if (action?.type === "url") {
      window.open(action.url, action.target || "_self");
    }
  };

  const iconBefore = icon && iconPosition === "before" ? icon : undefined;
  const iconAfter = icon && iconPosition === "after" ? icon : undefined;

  // If nested in a submenu
  if (isNested) {
    if (hasSubmenu) {
      return (
        <Menu.TriggerItem className={classNames({ "has-submenu": hasSubmenu })}>
          {iconBefore && <span className="menu-icon-before">{iconBefore}</span>}
          {label}
          {iconAfter && <span className="menu-icon-after">{iconAfter}</span>}
          <LuChevronRight />
        </Menu.TriggerItem>
      );
    }

    return (
      <Menu.Item
        value={label || ""}
        disabled={disabled}
        onClick={handleClick}
        className={classNames({ "has-submenu": hasSubmenu })}
      >
        {iconBefore && <span className="menu-icon-before">{iconBefore}</span>}
        {label}
        {iconAfter && <span className="menu-icon-after">{iconAfter}</span>}
      </Menu.Item>
    );
  }

  // Top-level trigger
  if (hasSubmenu) {
    return (
      <Menu.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          px={3}
          py={1}
          height="auto"
          fontWeight="normal"
        >
          {iconBefore && <span className="menu-icon-before">{iconBefore}</span>}
          {label}
          {iconAfter && <span className="menu-icon-after">{iconAfter}</span>}
        </Button>
      </Menu.Trigger>
    );
  }

  // Simple button without submenu (likely on a menu bar)
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={disabled}
      onClick={handleClick}
      px={3}
      py={1}
      height="auto"
      fontWeight="normal"
    >
      {iconBefore && <span className="menu-icon-before">{iconBefore}</span>}
      {label}
      {iconAfter && <span className="menu-icon-after">{iconAfter}</span>}
    </Button>
  );
};
