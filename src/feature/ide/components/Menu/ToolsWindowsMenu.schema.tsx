import { Menu } from "@/shared/Menu/state/menu.types";
import { useDockStore } from "@/feature/ide/components/DockingSystem/state/dock.store";
import { resolveDockIcon } from "@/feature/ide/components/DockingSystem/state/dock.icons";

/**
 * Menu schema for the tool windows.
 */
export const useMenuSchema = (): Menu => {
  const widgets = useDockStore((s) => s.settings.widgets);
  const toggleWidget = useDockStore((s) => s.toggleWidget);

  return {
    orientation: "vertical" as const,
    items: Object.values(widgets)
      .toSorted((a, b) => (a.weight ?? 0) - (b.weight ?? 0))
      .map((widget) => ({
        label: widget.params.title,
        icon: resolveDockIcon(widget.params.icon),
        checked: !widget.hidden,
        action: {
          type: "callback" as const,
          onClick: () => toggleWidget(widget.id),
        },
      })),
  };
};
