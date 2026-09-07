import { createElement } from "react";
import type { ReactNode } from "react";
import * as VscIcons from "react-icons/vsc";

import type { DockIconKey } from "./dock.types";

/**
 * Convert a kebab-case icon key to the PascalCase export name
 * used by react-icons/vsc.
 *
 * Example: "vsc-list-tree" → "VscListTree"
 */
function toPascalCase(key: string): string {
  return key
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

/**
 * Resolve a kebab-case icon key to a ReactNode.
 * Any icon exported from `react-icons/vsc` can be used.
 * Returns `null` for unknown keys.
 *
 * @example resolveDockIcon("vsc-list-tree") // → <VscListTree />
 */
export function resolveDockIcon(key: DockIconKey): ReactNode {
  const componentName = toPascalCase(key);
  const IconComponent = (VscIcons as Record<string, React.ComponentType>)[
    componentName
  ];

  if (!IconComponent) {
    console.warn(
      `[dock.icons] Unknown icon key: "${key}" (resolved to "${componentName}")`,
    );
    return null;
  }

  return createElement(IconComponent);
}
