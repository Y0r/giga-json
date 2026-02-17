import React, { useEffect } from "react";

import { Flex } from "@chakra-ui/react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { VscFile } from "react-icons/vsc";

import EditorTab from "@/feature/ide/components/EditorTabs/EditorTab";

import { useEditorStore } from "@/feature/ide/state/ide.store";
import { EditorFile } from "@/feature/ide/state/ide.types";

import classNames from "classnames";

import "@/feature/ide/styles/editor-tabs.scss";

interface EditorTabsProps {
  className?: string;
}

/**
 * Editor tabs component for the IDE.
 */
export const EditorTabs = (props: EditorTabsProps) => {
  const activeFileIds = useEditorStore((state) => state.activeFileIds);
  const files = useEditorStore((state) => state.files);
  const activeTabId = useEditorStore((state) => state.activeTabId);

  const [activeFiles, setActiveFiles] = React.useState<EditorFile[]>([]);

  useEffect(() => {
    setActiveFiles(activeFileIds.map((id) => files[id]).filter(Boolean));
  }, [activeFileIds, files]);

  console.log(activeFiles);

  const onDragEnd = (result: any) => {
    console.log(result);
    // @todo update active file ids.
  };

  return (
    <>
      {activeFiles && activeFiles.length && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId={"tabs"}
            isDropDisabled={false}
            isCombineEnabled={false}
          >
            {(droppableProvider) => (
              <Flex
                role={"navigation"}
                className={classNames("c-editor-tabs", props.className)}
                direction={"row"}
                justify={"flex-start"}
                flexWrap={"nowrap"}
                gap={1}
                overflowX={"scroll"}
                {...droppableProvider.droppableProps}
                ref={droppableProvider.innerRef}
              >
                {activeFiles.map((file: EditorFile, index) => (
                  <Draggable
                    draggableId={`tab-${file.id}`}
                    index={index}
                    key={index}
                  >
                    {(draggableProvider) => (
                      <div
                        {...draggableProvider.dragHandleProps}
                        {...draggableProvider.draggableProps}
                        ref={draggableProvider.innerRef}
                      >
                        <EditorTab
                          key={index}
                          className={"c-editor-tab__index-" + index}
                          fileName={file.name}
                          // @todo diff icons per content type.
                          icon={<VscFile />}
                          isActive={file.id === activeTabId}
                          isCloseable={true}
                          hasUnsavedChanges={file.hasUnsavedChanges}
                          onClick={() => {}}
                          onClose={() => {}}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {droppableProvider.placeholder}
              </Flex>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  );
};

export default EditorTabs;
