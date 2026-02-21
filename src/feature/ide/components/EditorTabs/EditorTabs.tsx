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

  // Hooks for data manipulation.
  const openTab = useEditorStore((state) => state.openTab);
  const closeTab = useEditorStore((state) => state.closeTab);
  const updateTabs = useEditorStore((state) => state.updateTabs);

  useEffect(() => {
    setActiveFiles(activeFileIds.map((id) => files[id]).filter(Boolean));
  }, [activeFileIds, files]);

  // @todo handle on store level?
  useEffect(() => {
    if (!activeTabId && activeFileIds.length > 0) {
      openTab(activeFileIds[0]);
    }
  }, [activeTabId]);

  /**
   * Open tab handler.
   *
   * @param {string} id - The file id to open.
   */
  const handleOpen = (id: string) => {
    openTab(id);
  };

  /**
   * Close tab handler.
   *
   * @param {string} id - The file id to close.
   *
   * @todo show hint about restoring closed files.
   */
  const handleClose = (id: string) => {
    closeTab(id);
  };

  /**
   * Drag and drop handler for the editor tabs.
   *
   * @param result
   */
  const handleDrag = (result: any) => {
    const { source, destination } = result;

    // Skip processing if the user dropped the item back where it came from.
    if (!destination) {
      return;
    }

    const updatedActiveFileIds = arrayReorder(
      activeFileIds,
      source.index,
      destination.index,
    );

    updateTabs(updatedActiveFileIds);
  };

  return (
    <>
      {activeFiles && activeFiles.length > 0 && (
        <DragDropContext onDragEnd={handleDrag}>
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
                          fileId={file.id}
                          fileName={file.name}
                          // @todo diff icons per content type.
                          icon={<VscFile />}
                          isActive={file.id === activeTabId}
                          isCloseable={true}
                          hasUnsavedChanges={file.hasUnsavedChanges}
                          onClick={handleOpen}
                          onClose={handleClose}
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
