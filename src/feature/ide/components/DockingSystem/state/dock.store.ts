import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { DockState } from "./dock.types";
import { DEFAULT_DOCK_SETTINGS } from "./dock.defaults";

export const useDockStore = create<DockState>()(
  persist(
    (set) => ({
      settings: DEFAULT_DOCK_SETTINGS,
      resetSettings: () => set({ settings: DEFAULT_DOCK_SETTINGS }),
      moveWidget: (widgetId, targetGroupId) =>
        set((state) => {
          const widget = state.settings.widgets[widgetId];
          if (!widget) return state;

          return {
            settings: {
              ...state.settings,
              widgets: {
                ...state.settings.widgets,
                [widgetId]: {
                  ...widget,
                  groupId: targetGroupId,
                },
              },
            },
          };
        }),
      changeGroupState: (groupId, options) =>
        set((state) => {
          const group = state.settings.groups[groupId];
          if (!group) return state;

          return {
            settings: {
              ...state.settings,
              groups: {
                ...state.settings.groups,
                [groupId]: {
                  ...group,
                  options: {
                    ...group.options,
                    ...options,
                  },
                },
              },
            },
          };
        }),
    }),
    {
      name: "dock-store",
    },
  ),
);
