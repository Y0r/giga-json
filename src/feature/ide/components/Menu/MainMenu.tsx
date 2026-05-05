import React from "react";
import { Menu } from "@/shared/Menu";
import { useMenuSchema } from "@/feature/ide/components/Menu/MainMenu.schema";

export const MainMenu = () => {
  return <Menu className={"c-main-menu"} menu={useMenuSchema()} />;
};
