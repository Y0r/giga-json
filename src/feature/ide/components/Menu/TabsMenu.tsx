import React, { ReactNode } from "react";
import { MenuFromContext } from "@/shared/Menu";
import { useMenuSchema } from "@/feature/ide/components/Menu/TabsMenu.schema";
import { EditorFile } from "@/feature/ide/state/ide.types";

interface TabsMenuProps {
  focusedTabId: EditorFile["id"];
  children: ReactNode;
}

export const TabsMenu = ({ focusedTabId, children }: TabsMenuProps) => {
  return (
    <MenuFromContext items={useMenuSchema(focusedTabId).items}>
      {children}
    </MenuFromContext>
  );
};
