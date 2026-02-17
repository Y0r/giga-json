import React, { ReactNode } from "react";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { VscClose } from "react-icons/vsc";

import classNames from "classnames";

interface EditorTabProps {
  className?: string;
  fileName: string;
  icon: ReactNode | null;
  isActive: boolean;
  isCloseable: boolean;
  hasUnsavedChanges: boolean;
  onClick: () => void;
  onClose: () => void;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Editor tab component for the IDE Editor.
 */
export const EditorTab = ({
  className,
  fileName,
  icon,
  isActive,
  isCloseable = true,
  hasUnsavedChanges = false,
  onClick,
  onClose,
  ref,
}: EditorTabProps) => {
  /**
   * Simple handler to open the editor tab.
   */
  const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    onClick();
  };

  const handleClose = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    onClose();
  };

  return (
    <Flex
      role={"tab"}
      tabIndex={0}
      className={classNames("c-editor-tab", className)}
      direction={"row"}
      justify={"flex-start"}
      alignContent={"end"}
      alignItems={"end"}
      gap={2}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          handleClick(event);
        }
      }}
    >
      <div className={"c-editor-tab__icon"}>
        <Icon size={"sm"} color={"white"}>
          {icon}
        </Icon>
      </div>

      <Text
        textStyle={"sm"}
        color={"white"}
        textWrap={"nowrap"}
        className={"c-editor-tab__title"}
      >
        {fileName}
      </Text>

      {hasUnsavedChanges && (
        <div className={"c-editor-tab__unsaved-changes"}>!</div>
      )}

      {isCloseable && (
        <button
          className={"c-editor-tab__close"}
          onClick={handleClose}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleClose(event);
            }
          }}
        >
          <Icon size={"sm"} color={"white"}>
            <VscClose />
          </Icon>
        </button>
      )}
    </Flex>
  );
};

export default EditorTab;
