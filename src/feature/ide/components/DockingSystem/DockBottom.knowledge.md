### Dock Bottom Region Restoration

To restore the static bottom region in the docking system, follow these steps:

#### 1. Update Types

In `src/feature/ide/components/DockingSystem/state/dock.types.ts`:

- Add `"bottom"` to the `DockGroupPosition` union type.
- (Optional) Add `"console"` to `DockWidgetComponent` if you want to restore the console widget.

#### 2. Update Defaults

In `src/feature/ide/components/DockingSystem/state/dock.defaults.ts`:

- Add the `bottom` group to `DEFAULT_DOCK_SETTINGS.groups`:

```typescript
bottom: {
  id: "bottom",
  position: "bottom",
  options: {
    initialSize: 100,
    locked: true,
    hideHeader: true,
  },
  weight: 30,
},
```

- Add the `console` widget to `DEFAULT_DOCK_SETTINGS.widgets` (or any other widget you want in the bottom):

```typescript
console: {
  id: "console",
  component: "console",
  tabComponent: "default",
  groupId: "bottom",
  params: {
    title: "Console",
    description: "Static information and logs.",
    icon: "vsc-terminal",
  },
  options: { draggable: false },
  weight: 10,
},
```

#### 3. Update Dock Component

In `src/feature/ide/components/DockingSystem/Dock.tsx`:

**A. Add drop restrictions in `onWillDrop`:**

```typescript
const isBottom = location.type === "edge" && location.position === "bottom";
if (isBottom) {
  e.preventDefault();
  return;
}
```

And in the `else` block (when there is no target group):

```typescript
if (e.position === "bottom") {
  e.preventDefault();
  return;
}
```

**B. Add migration logic to `onReady`:**

```typescript
const bottomGroup = Object.values(initialSettings.groups).find(
  (g) => g.position === "bottom",
);
if (
  bottomGroup &&
  (bottomGroup.options.locked !== true ||
    bottomGroup.options.hideHeader !== true)
) {
  setTimeout(() => {
    useDockStore.getState().changeGroupState(bottomGroup.id, {
      locked: true,
      hideHeader: true,
    });
  }, 0);
}
```

**C. Force options in `addEdgeGroup`:**

```typescript
const edgeGroupApi = event.api.addEdgeGroup(group.position, {
  id: group.id,
  ...group.options,
  locked: group.position === "bottom" ? true : group.options.locked,
  hideHeader: group.position === "bottom" ? true : group.options.hideHeader,
} as any);
```

#### 4. Register Components

In `src/feature/ide/components/DockingSystem/DockWidgets.tsx`:

- Import and add the desired widget (e.g., `ConsoleWidget`) to the `DOCK_COMPONENTS` registry.
