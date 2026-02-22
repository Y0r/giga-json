import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import classNames from "classnames";

type LayoutProps = {
  className?: string;
  children?: React.ReactNode;
} & Omit<BoxProps, "className" | "children">;

/**
 * Default layout for the application which provides a simple and responsive layout structure.
 *
 * @param {object} data - The component props.
 * @param {string} data.className - Additional CSS class names to apply to the layout container.
 * @param {React.ReactNode} data.children - The content to be rendered within the layout.
 * @param {array} data.props - Additional props to be passed to the Box component.
 */
export const Layout: React.FC<LayoutProps> = ({
  className,
  children,
  ...props
}: LayoutProps) => {
  return (
    <Box
      className={classNames("c-layout", className)}
      position={"relative"}
      {...props}
    >
      {children}
    </Box>
  );
};
