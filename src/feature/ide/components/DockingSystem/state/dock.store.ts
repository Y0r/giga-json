import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { DockState, DockWidgetParams } from "./dock.types";
import { DEFAULT_DOCK_SETTINGS } from "./dock.defaults";

export const useDockStore = create<DockState>()(
  persist(
    (set) => ({
      settings: DEFAULT_DOCK_SETTINGS,
      resetSettings: () => set({ settings: DEFAULT_DOCK_SETTINGS }),
      changeWidgetState: (widgetId, property, value) =>
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
                  params: {
                    ...widget.params,
                    [property]: value,
                  },
                },
              },
            },
          };
        }),
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
    }),
    {
      name: "dock-store",
    },
  ),
);
