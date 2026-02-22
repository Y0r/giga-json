/**
 * Defines the orientation of the menu layout.
 */
export type MenuOrientation = "horizontal" | "vertical";

/**
 * Configuration for a menu structure.
 */
export type Menu = {
  /** The orientation of the menu. Defaults to "vertical". */
  orientation?: MenuOrientation;
  /** The list of items in the menu. */
  items: MenuItem[];
};

/**
 * Position of the icon relative to the label.
 */
export type IconPosition = "before" | "after";

/**
 * Represents a clickable action for a menu item.
 */
export type MenuItemAction =
  | {
      /** Execute a callback function. */
      type: "callback";
      /** The function to call when the item is clicked. */
      onClick: () => void;
    }
  | {
      /** Navigate to a URL. */
      type: "url";
      /** The URL to navigate to. */
      url: string;
      /** The target attribute for the link. */
      target?: "_blank" | "_self" | "_parent" | "_top";
    };

/**
 * Represents an individual entry in a menu.
 */
export type MenuItem = {
  /** The type of the item. Defaults to "item". */
  type?: "item" | "separator";
  /** The text label of the item. Required if type is "item". */
  label?: string;
  /** Optional icon to display. */
  icon?: React.ReactNode;
  /** Position of the icon relative to the label. Defaults to "before". */
  iconPosition?: IconPosition;
  /** Action to perform when clicked. */
  action?: MenuItemAction;
  /** Submenu items if this item has a nested menu. */
  items?: MenuItem[];
  /** Whether the item is interactive. */
  disabled?: boolean;
};
