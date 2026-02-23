import React, { Fragment } from "react";

import { StableLayout } from "@/shared/Layout/StableLayout";
import { Layout } from "@/shared/Layout/Layout";

import { Editor, EditorTabs } from "@/feature/ide/components";
import { MainMenu } from "@/feature/ide/components/Menu/MainMenu";
import { Logo } from "@/shared/Identica/Logo";

import "@/feature/ide/styles/ide.scss";
import { Flex, Text } from "@chakra-ui/react";

interface IDEProps {}

export const IDE = (props: IDEProps) => {
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
    </StableLayout>
  );
};

export default IDE;
