import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { EditorFile } from "@/feature/ide/state/ide.types";
import { useEditorStore } from "@/feature/ide/state/ide.store";
import debounce from "@/feature/ide/utils/debounce";

import type * as monaco from "monaco-editor";

import {
  Editor as MonacoEditor,
  EditorProps,
  Monaco,
} from "@monaco-editor/react";

import { useMonacoCursor } from "@/feature/ide/hooks/useMonacoCursor";

import { config } from "@/config";

/**
 * Editor component for the IDE.
 *
 * Editor Sync Workflow:
 * To handle high-frequency events (typing, cursor moves) without data loss,
 * the IDE uses an Accumulator/Ref pattern in the Editor component.
 * 1. Changes are collected in a local Ref (`pendingChangesRef`).
 * 2. A debounced sync (500ms) merges these changes into the global `ide.store`.
 * 3. Immediate "flushing" is triggered via `flushPendingChanges` during tab switches,
 *    unmounting, or before critical actions (e.g., formatting on Ctrl+S).
 */
export const Editor = (props: EditorProps) => {
  // Global-state variables.
  const files = useEditorStore((state) => state.files);
  const activeTabId = useEditorStore((state) => state.activeTabId);

  // Hooks to work with global state.
  const openTab = useEditorStore((state) => state.openTab);
  const updateFile = useEditorStore((state) => state.updateFile);
  const setFlushPendingChanges = useEditorStore(
    (state) => state.setFlushPendingChanges,
  );

  // Helpers to work with Monaco.
  const { getOffsetFromPosition, getPositionFromOffset } = useMonacoCursor();

  // Objects to contain instance of Monaco editor.
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const [isInitialised, setIsInitialised] = useState(false);
  const [models, setModels] = useState<
    Record<string, monaco.editor.ITextModel>
  >({});

  // Ref to accumulate changes before syncing to the global store.
  const pendingChangesRef = useRef<Record<string, Partial<EditorFile>>>({});

  /**
   * Commits pending changes for a specific file to the global store.
   *
   * @param id - The ID of the file to flush changes for.
   */
  const flushChanges = useCallback(
    (id: string) => {
      const changes = pendingChangesRef.current[id];
      if (changes && Object.keys(changes).length > 0) {
        updateFile(id, changes);
        delete pendingChangesRef.current[id];
      }
    },
    [updateFile],
  );

  /**
   * Debounced version of flushChanges to provide a stable sync to the global store.
   */
  const debouncedFlush = useMemo(
    () => debounce((id: string) => flushChanges(id), config.changesSyncDelay),
    [flushChanges],
  );

  /**
   * Ensures pending changes are flushed when switching tabs or unmounting.
   */
  useEffect(() => {
    setFlushPendingChanges(flushChanges);

    return () => {
      if (activeTabId) {
        flushChanges(activeTabId);
      }
    };
  }, [activeTabId, flushChanges, setFlushPendingChanges]);

  /**
   * ModelSyncEffect
   *
   * This hook synchronizes the Monaco models with the files in the global store.
   * It uses an incremental approach (creating new ones and disposing of old ones)
   * to preserve the undo/redo stack and editor markers for existing tabs.
   */
  useEffect(() => {
    // Wait until Monaco and the editor are initialized.
    if (!isInitialised || !monacoRef.current) return;
    const monaco = monacoRef.current;

    setModels((prevModels) => {
      const nextModels = { ...prevModels };
      let hasChanged = false;

      // Loop through the files and create models for each.
      // Skip if the model exists and dispose of it if a file was removed.
      Object.entries(files).forEach(([id, file]) => {
        if (nextModels[id]) {
          // If the model already exists, check if its content needs updating.
          // This ensures that external changes (e.g., from formatting) are reflected.
          if (file.hasBeenUpdated) {
            if (config.debugEditorEvents) {
              console.log("Model has been updated with new values.");
            }

            const model = nextModels[id];
            model.setValue(file.content);

            const newPosition = getPositionFromOffset(model, file.cursorOffset);

            updateFile(id, {
              cursor: newPosition,
              hasBeenUpdated: false,
            });

            if (editorRef.current && id === activeTabId) {
              editorRef.current.setPosition(newPosition);
              editorRef.current.revealPositionInCenterIfOutsideViewport(
                newPosition,
              );
            }
          }
        } else {
          const uri = monaco.Uri.parse(file.path);
          let model = monaco.editor.getModel(uri);

          if (!model) {
            model = monaco.editor.createModel(file.content, file.language, uri);
          }

          nextModels[id] = model;
          hasChanged = true;
        }
      });

      // Targeted Disposal for files that are no longer in the store.
      Object.keys(nextModels).forEach((id) => {
        if (!files[id]) {
          nextModels[id].dispose();
          delete nextModels[id];
          hasChanged = true;
        }
      });

      return hasChanged ? nextModels : prevModels;
    });
  }, [isInitialised, files, activeTabId, getPositionFromOffset, updateFile]);

  /**
   * This hook manages the active model in the editor and synchronizes content changes.
   * The "patient" approach ensures that if a new file is created, we wait for its
   * model to be initialized before attempting to set it, preventing accidental
   * redirections caused by race conditions.
   */
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || !activeTabId) return;
    const editor = editorRef.current;

    const model = models[activeTabId];

    if (!model) {
      // If the file exists in the store but its model hasn't been created yet,
      // break processing and wait for the model management effect to catch up.
      if (files[activeTabId]) return;

      // Redirect to the first available tab if the file itself is missing from the store.
      const firstFileId = Object.keys(files)[0];
      if (firstFileId && firstFileId !== activeTabId) {
        openTab(firstFileId);

        // @todo register an error.
        const error = `Tried to open tab for ${activeTabId} file, but no model was found. Opening first available model instead.`;
        console.log(error);
      }
      return;
    }

    // Set the active model in the editor.
    editor.setModel(model);

    const onChangeCursor = editor.onDidChangeCursorPosition(
      (event: monaco.editor.ICursorPositionChangedEvent) => {
        // Skip the cursor update if the change was not caused by an explicit user action, undo, or redo.
        const allowedReasons = [
          monacoRef.current!.editor.CursorChangeReason.Explicit,
          monacoRef.current!.editor.CursorChangeReason.Undo,
          monacoRef.current!.editor.CursorChangeReason.Redo,
          monacoRef.current!.editor.CursorChangeReason.Paste,
        ];

        if (config.debugEditorEvents) {
          console.log("Model cursor position has changed.", event);
        }

        if (!allowedReasons.includes(event.reason)) {
          return;
        }

        if (config.debugEditorEvents) {
          console.log("Cursor change triggered a file change.", event);
        }

        const position = editor.getPosition();
        const positionOffset = getOffsetFromPosition(model, position);

        pendingChangesRef.current[activeTabId] = {
          ...pendingChangesRef.current[activeTabId],
          cursor: position,
          cursorOffset: positionOffset,
        };

        debouncedFlush(activeTabId);
      },
    );

    const onChangeModel = editor.onDidChangeModelContent(
      (event: monaco.editor.IModelContentChangedEvent) => {
        if (config.debugEditorEvents) {
          console.log("Model content has changed.", event);
        }

        if (event.isFlush) {
          return;
        }

        if (config.debugEditorEvents) {
          console.log("Content change triggered a file change.", event);
        }

        const position = editor.getPosition();
        const positionOffset = getOffsetFromPosition(model, position);

        pendingChangesRef.current[activeTabId] = {
          ...pendingChangesRef.current[activeTabId],
          content: editor.getValue(),
          cursor: position,
          cursorOffset: positionOffset,
          hasUnformattedChanges: true,
        };
        debouncedFlush(activeTabId);
      },
    );

    return () => {
      onChangeCursor.dispose();
      onChangeModel.dispose();
    };
  }, [
    activeTabId,
    models,
    files,
    openTab,
    debouncedFlush,
    flushChanges,
    getOffsetFromPosition,
  ]);

  /**
   * Ensures all Monaco models are disposed of when the Editor component is unmounted.
   */
  useEffect(() => {
    return () => {
      setModels((prev) => {
        Object.values(prev).forEach((m) => m.dispose());
        return {};
      });
    };
  }, []);

  return (
    <MonacoEditor
      width={"100%"}
      height={"85vh"}
      theme={"vs-dark"}
      onMount={useCallback(
        (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
          editorRef.current = editor;
          monacoRef.current = monaco;
          setIsInitialised(true);
        },
        [],
      )}
    />
  );
};

export default Editor;
