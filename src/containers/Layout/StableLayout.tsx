import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import classNames from "classnames";

type StableLayoutProps = {
  className?: string;
  children: React.ReactNode;
} & Omit<BoxProps, "className" | "children">;

/**
 * Default layout for the application which provides a stable and responsive layout structure.
 *
 * The key feature of this layout is its ability to maintain a consistent layout across different screen sizes and orientations.
 *
 * @param {string} className - Additional CSS class names to apply to the layout container.
 * @param {React.ReactNode} children - The content to be rendered within the layout.
 * @param {array} props - Additional props to be passed to the Box component.
 * @constructor
 */
export const StableLayout: React.FC<StableLayoutProps> = ({
  className,
  children,
  ...props
}: StableLayoutProps) => {
  return (
    <Box
      className={classNames("cn-stable-layout", className)}
      w={"100%"}
      h={"100vh"}
      position={"relative"}
      overflow={"hidden"}
      {...props}
    >
      {children}
    </Box>
  );
};
