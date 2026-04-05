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
import { ModalManager } from "@/feature/modalManager/ModalManager";

import "@/feature/ide/styles/ide.scss";

interface IDEProps {}

/**
 * IDE Component.
 *
 * This component serves as the main entry point for the IDE feature.
 */
export const IDE = (props: IDEProps) => {
  // Override default shortcuts.
  overrideShortcuts();

  return (
    <StableLayout className={"c-ide"}>
      <Layout className={"c-ide-heading"}>
        <Flex alignItems={"center"} alignContent={"center"} gap={3} pb={1}>
          <Logo />
          <MainMenu />
        </Flex>
      </Layout>

      <StableLayout className={"c-ide__content"}>
        {/* @todo add wrapper to allow orientation change. */}
        <EditorTabs />
        <Editor />

        {/* @todo render left sidebar */}
      </StableLayout>

      <Layout className={"c-ide-footer"}>
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
const overrideShortcuts = () => {
  // Skip reload on ctrl + r.
  useReloadOverride();

  // Skip save as on ctrl + s, trigger reformat instead.
  useSaveAsOverride();

  // Add search on double shift.
  useSearchOverride();
};

export default IDE;
