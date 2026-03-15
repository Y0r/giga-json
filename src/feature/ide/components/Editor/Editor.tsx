import React, { useCallback, useEffect, useRef, useState } from "react";

import { useEditorStore } from "@/feature/ide/state/ide.store";
import debounce from "@/feature/ide/utils/debounce";

import {
  Editor as MonacoEditor,
  EditorProps,
  Monaco,
} from "@monaco-editor/react";

/**
 * Editor component for the IDE.
 */
export const Editor = (props: EditorProps) => {
  // Global-state variables.
  const files = useEditorStore((state) => state.files);
  const activeTabId = useEditorStore((state) => state.activeTabId);

  // Hooks to work with global state.
  const openTab = useEditorStore((state) => state.openTab);
  const updateFile = useEditorStore((state) => state.updateFile);

  // Objects to contain instance of Monaco editor.
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const [isInitialised, setIsInitialised] = useState(false);
  const [models, setModels] = useState<
    Record<string, monaco.editor.ITextModel>
  >({});

  /**
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
        if (!nextModels[id]) {
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
  }, [isInitialised, files]);

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

        const error = `Tried to open tab for ${activeTabId} file, but no model was found. Opening first available model instead.`;
        console.log(error);
      }
      return;
    }

    // Set the active model in the editor.
    editor.setModel(model);

    // Sync editor content back to the global store with a debounce.
    const modifyModelContent = debounce((content: string) => {
      updateFile(activeTabId, { content });
    }, 500);

    const disposable = editor.onDidChangeModelContent(() => {
      modifyModelContent(editor.getValue());
    });

    return () => {
      disposable.dispose();
    };
  }, [activeTabId, models, updateFile]);

  return (
    <MonacoEditor
      width={"100%"}
      height={"85vh"}
      theme={"vs-dark"}
      onMount={(
        editor: monaco.editor.IStandaloneCodeEditor,
        monaco: Monaco,
      ) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
        setIsInitialised(true);
      }}
    />
  );
};

export default Editor;
