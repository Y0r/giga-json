import React from "react";
import { FallbackProps } from "react-error-boundary";
import {
  AbsoluteCenter,
  BlockquoteCaption,
  BlockquoteContent,
  BlockquoteRoot,
  Box,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";

import { config } from "@/config";

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <AbsoluteCenter
      className={"cm-error-fallback"}
      role={"alert"}
      border={"sm"}
      borderRadius={"lg"}
      background={"purple.500"}
    >
      <Box padding={"20"}>
        <Text fontSize={"6rem"} fontWeight={"extrabold"}>
          {"(っ╥﹏╥ς)"}
        </Text>

        <Box paddingTop={"8"}>
          <Heading textStyle={"2xl"} fontWeight={"bold"} textWrap={"nowrap"}>
            {"People complain, devs washes its hands of the problem."}
          </Heading>

          <Text textStyle={"md"} fontWeight={"light"}>
            {"Something went wrong and we couldn't render the page."}
          </Text>

          {/* Full error message should only be displayed in development mode */}
          {config.debugDisplayErrors && error instanceof Error && (
            <BlockquoteRoot
              padding={"2"}
              marginTop={"4"}
              variant={"solid"}
              colorPalette={"purple"}
            >
              <BlockquoteContent textStyle={"md"} fontWeight={"light"}>
                <Text color={"white"}>{error.message}</Text>
              </BlockquoteContent>

              {error.cause && error.cause.stack && (
                <BlockquoteCaption textStyle={"md"} fontWeight={"light"}>
                  <Text color={"white"}>{error.cause.stack}</Text>
                </BlockquoteCaption>
              )}
            </BlockquoteRoot>
          )}

          <Button
            marginTop={"8"}
            variant={"solid"}
            size={"md"}
            colorPalette={"white"}
            onClick={resetErrorBoundary}
          >
            {"Try again"}
          </Button>
        </Box>
      </Box>
    </AbsoluteCenter>
  );
};
