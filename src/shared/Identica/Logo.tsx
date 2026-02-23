import React from "react";
import { Flex, Icon, Image, Text } from "@chakra-ui/react";

export const Logo = () => {
  return (
    <Flex gap={1}>
      <Icon size={"md"} color={"white"}>
        <Image src="/assets/logo-light.svg" alt="Sycamore Tree" />
      </Icon>

      <Text fontSize={"sm"} fontWeight={"bold"} color={"white"}>
        {"GSON"}
      </Text>
    </Flex>
  );
};
