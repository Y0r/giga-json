import { TreeWidget } from "@/feature/ide/components/Widgets/PanelWigets/TreeWidget/TreeWidget";
import { BookmarksWidget } from "@/feature/ide/components/Widgets/PanelWigets/BookmarksWidget/BookmarksWidget";
import { NotificationsWidget } from "@/feature/ide/components/Widgets/PanelWigets/NotificationsWidget/NotificationsWidget";

/**
 * Registry of available dock widgets.
 * Maps widget component keys to their React components.
 */
export const DOCK_COMPONENTS = {
  tree: TreeWidget,
  bookmarks: BookmarksWidget,
  notifications: NotificationsWidget,
};
