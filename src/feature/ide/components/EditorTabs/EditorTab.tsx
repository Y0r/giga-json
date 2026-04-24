import React, { ReactNode } from "react";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { VscClose } from "react-icons/vsc";

import classNames from "classnames";

interface EditorTabProps {
  className?: string;
  fileId: string;
  fileName: string;
  icon: ReactNode | null;
  isActive: boolean;
  isCloseable: boolean;
  hasUnsavedChanges: boolean;
  onClick: (fileId: string) => void;
  onClose: (fileId: string) => void;
}

/**
 * Editor tab component for the IDE Editor.
 */
export const EditorTab = ({
  className,
  fileId,
  fileName,
  icon,
  isActive,
  isCloseable = true,
  hasUnsavedChanges = false,
  onClick,
  onClose,
}: EditorTabProps) => {
  /**
   * Simple handler to open the editor tab.
   *
   * @param {React.Event} event - The event object.
   */
  const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onClick(fileId);
  };

  /**
   * Simple handler to close the editor tab.
   *
   * @param {React.Event} event - The event object.
   */
  const handleClose = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onClose(fileId);
  };

  return (
    <Flex
      role={"tab"}
      tabIndex={0}
      className={classNames(
        className,
        "c-editor-tab",
        "c-editor-tab__id" + fileId,
        {
          "c-editor-tab__active": isActive,
        },
      )}
      direction={"row"}
      justify={"flex-start"}
      alignContent={"end"}
      alignItems={"end"}
      gap={1}
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
        <div className={"c-editor-tab__unsaved-changes"}></div>
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
