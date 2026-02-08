import React from "react";
import { Box } from "@chakra-ui/react";

interface StableLayoutProps {
  children: React.ReactNode;
}

/**
 * Default layout for the application which provides a stable and responsive layout structure.
 *
 * The key feature of this layout is its ability to maintain a consistent layout across different screen sizes and orientations.
 *
 * @param children
 * @constructor
 */
export const StableLayout: React.FC<StableLayoutProps> = ({
  children,
}: StableLayoutProps) => {
  return (
    <Box
      className={"cn-stable-layout"}
      w={"100%"}
      h={"100vh"}
      position={"relative"}
      overflow={"hidden"}
    >
      {children}
    </Box>
  );
};
