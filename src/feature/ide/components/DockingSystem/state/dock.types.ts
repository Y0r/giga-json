/**
 * String key for a dock icon in kebab-case (e.g. "vsc-list-tree").
 * Resolved to ReactNode at render time via the icon registry.
 * Any icon from `react-icons/vsc` can be used — the key is
 * converted to PascalCase and looked up dynamically.
 */
export type DockIconKey = string;

// ─── Group Types ────────────────────────────────────────────

/** Only left and right edge groups are supported. */
export type DockGroupPosition = "left" | "right";

/**
 * Options forwarded to dockview's `addEdgeGroup`.
 * Mirrors the subset of `EdgeGroupOptions` that we control,
 * keeping our API decoupled from dockview internals.
 */
export interface DockGroupOptions {
  initialSize?: number;
  minimumSize?: number;
  maximumSize?: number;
  collapsedSize?: number;
  collapsed?: boolean;
}

/** A dock edge group definition. */
export interface DockGroup {
  id: string;
  position: DockGroupPosition;
  options: DockGroupOptions;
}

// ─── Widget Param Types ─────────────────────────────────────

/**
 * Params consumed by the DockPanel (body) component.
 * A subset of the full widget params — panel doesn't need icon info.
 */
export interface DockPanelParams {
  title: string;
  description: string;
  isOpened: boolean;
}

/**
 * Params consumed by the DockTab (header) component.
 * Includes icon key for rendering the tab icon.
 */
export interface DockTabParams {
  title: string;
  description: string;
  icon: DockIconKey;
  isOpened?: boolean;
  isDeleted?: boolean;
}

/**
 * Combined params stored in settings and passed through dockview.
 * Dockview delivers the same `params` object to both the panel
 * and tab components — each reads only the fields it needs.
 */
export interface DockWidgetParams {
  title: string;
  description: string;
  icon: DockIconKey;
  isOpened?: boolean;
  isDeleted?: boolean;
}

// ─── Widget Types ───────────────────────────────────────────

/**
 * Component nickname — maps to a key in `DockviewReact.components`.
 * Extend this union as new panel renderers are added.
 */
export type DockWidgetComponent = "default";

/**
 * Tab component nickname — maps to a key in `DockviewReact.tabComponents`.
 * Extend this union as new tab renderers are added.
 */
export type DockWidgetTabComponent = "default";

/** A single widget (panel) definition. */
export interface DockWidget {
  id: string;
  component: DockWidgetComponent;
  tabComponent: DockWidgetTabComponent;
  /** Which group this widget belongs to (by group id). */
  groupId: string;
  params: DockWidgetParams;
}

// ─── Settings ───────────────────────────────────────────────

/** The complete dock settings — groups + their widgets. */
export interface DockSettings {
  groups: Record<string, DockGroup>;
  widgets: Record<string, DockWidget>;
}

// ─── Store State ────────────────────────────────────────────
type DockWidgetStateProperty = keyof Pick<
  DockWidgetParams,
  "isOpened" | "isDeleted"
>;

export interface DockState {
  /** Current dock settings (groups + widgets). */
  settings: DockSettings;
  /** Reset all settings to defaults. */
  resetSettings: () => void;
  /** Show / hide or delete a widget. */
  changeWidgetState: (
    widgetId: string,
    property: DockWidgetStateProperty,
    value: boolean,
  ) => void;
  /** Move a widget to a different group. */
  moveWidget: (widgetId: string, targetGroupId: string) => void;
}
