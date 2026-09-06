import React from "react";

import {
  useReloadOverride,
  useSaveAsOverride,
  useSearchOverride,
} from "@/feature/ide/services/shortcutSystem/overrides/overrides";

import { StableLayout } from "@/shared/Layout/StableLayout";
import { Layout } from "@/shared/Layout/Layout";
import { Flex } from "@chakra-ui/react";

import { Logo } from "@/shared/Identica/Logo";
import { MainMenu } from "@/feature/ide/components/Menu/MainMenu";
import { Editor, EditorTabs } from "@/feature/ide/components";
import { Dock } from "@/feature/ide/components/DockingSystem/Dock";
import { DOCK_COMPONENTS } from "@/feature/ide/components/DockingSystem/DockWidgets";

import { ModalManager } from "@/feature/modalManager/ModalManager";

import { IDE_SELECTORS } from "@/feature/ide/constants";
import "./IDE.scss";

/**
 * IDE Component.
 *
 * This component serves as the main entry point for the IDE feature.
 */
export const IDE = () => {
  // Override default shortcuts.
  useOverrideShortcuts();

  return (
    <StableLayout className={IDE_SELECTORS.container}>
      <Layout
        className={IDE_SELECTORS.heading}
        style={{ padding: "0 var(--gson-spacing-6)" }}
      >
        <Flex alignItems={"center"} alignContent={"center"} gap={3} pb={1}>
          <Logo />
          <MainMenu />
        </Flex>
      </Layout>

      {/* @todo resolve problem with height. */}
      <Dock components={DOCK_COMPONENTS}>
        <div className={IDE_SELECTORS.content}>
          {/* @todo add wrapper to allow orientation change. */}
          <EditorTabs />
          <Editor />
        </div>
      </Dock>

      <Layout className={IDE_SELECTORS.footer}>
        {/* @todo display file path in footer. */}
        {/* @todo render goto-line widget */}
      </Layout>

      {/* Misc. renderings */}
      <ModalManager />
    </StableLayout>
  );
};

/**
 * Override default shortcuts using the shortcut system.
 */
const useOverrideShortcuts = () => {
  // Skip reload on ctrl + r.
  useReloadOverride();
  // Skip save as on ctrl + s, trigger reformat instead.
  useSaveAsOverride();
  // Add search on double shift.
  useSearchOverride();
};

export default IDE;
