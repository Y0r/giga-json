import React from "react";

import { useModalStore } from "@/feature/modalManager/state/modal.store";
import { usePreventReload } from "@/feature/ide/hooks/usePreventReload";

import { StableLayout } from "@/shared/Layout/StableLayout";
import { Layout } from "@/shared/Layout/Layout";
import { Flex } from "@chakra-ui/react";

import { Logo } from "@/shared/Identica/Logo";
import { MainMenu } from "@/feature/ide/components/Menu/MainMenu";
import { Editor, EditorTabs } from "@/feature/ide/components";
import { ModalManager } from "@/feature/modalManager/ModalManager";

import "@/feature/ide/styles/ide.scss";

interface IDEProps {}

export const IDE = (props: IDEProps) => {
  const openModal = useModalStore((s) => s.openModal);

  // Helper to stop reload and inform user about potential data loss.
  usePreventReload(() => openModal("RELOAD_CONFIRMATION"));

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

export default IDE;
