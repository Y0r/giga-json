import React from "react";

import { Button, Flex, Kbd, Menu } from "@chakra-ui/react";
import { MenuItem as MenuItemType } from "@/shared/Menu/state/menu.types";
import { LuChevronRight } from "react-icons/lu";

import classNames from "classnames";

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
    shortcut,
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

  const content = (
    <>
      <Flex
        className={"menu-label"}
        justify={"flex-start"}
        flexWrap={"nowrap"}
        alignItems={"center"}
        alignContent={"center"}
        gap={1}
        mr={3}
      >
        {iconBefore && <span className="menu-icon-before">{iconBefore}</span>}
        {label}
        {iconAfter && <span className="menu-icon-after">{iconAfter}</span>}
      </Flex>

      {/* Render shortcut if available.*/}
      {shortcut && (
        <Kbd className="menu-shortcut" ml="auto" size={"sm"} variant={"subtle"}>
          {shortcut}
        </Kbd>
      )}
    </>
  );

  // If nested in a submenu
  if (isNested) {
    const className = classNames({ "has-submenu": hasSubmenu });
    if (hasSubmenu) {
      return (
        <Menu.TriggerItem className={className}>
          {content}
          <LuChevronRight />
        </Menu.TriggerItem>
      );
    }

    return (
      <Menu.Item
        value={label || ""}
        disabled={disabled}
        onClick={handleClick}
        className={className}
      >
        {content}
      </Menu.Item>
    );
  }

  const buttonProps = {
    variant: "ghost" as const,
    size: "sm" as const,
    disabled,
    px: 3,
    py: 1,
    height: "auto",
    fontWeight: "normal",
  };

  // Top-level trigger
  if (hasSubmenu) {
    return (
      <Menu.Trigger asChild>
        <Button {...buttonProps}>{content}</Button>
      </Menu.Trigger>
    );
  }

  // Simple button without submenu (likely on a menu bar)
  return (
    <Button {...buttonProps} onClick={handleClick}>
      {content}
    </Button>
  );
};
