import React, { useEffect, useRef, useState } from "react";

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
  const updateFile = useEditorStore((state) => state.updateFile);

  // Objects to contain instance of Monaco editor.
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const [isInitialised, setIsInitialised] = useState(false);
  const [models, setModels] = useState<
    Record<string, monaco.editor.ITextModel>
  >({});

  /**
   * Initialize models for all files and handle their disposal.
   * Runs when the editor is initialized.
   *
   * @todo ensure models couldn't be serialized and saved as file property.
   */
  useEffect(() => {
    // Skip if there are no entities to work with.
    if (!editorRef.current || !monacoRef.current) return;

    // Create models from files.
    const modelsFromFiles: Record<string, monaco.editor.ITextModel> = {};
    for (const [key, file] of Object.entries(files)) {
      // Skip if a model with the id are already exists.
      if (modelsFromFiles[key]) continue;

      modelsFromFiles[key] = monacoRef.current.editor.createModel(
        file.content,
        file.language,
        monacoRef.current.Uri.parse(file.path),
      );
    }

    setModels(modelsFromFiles);

    return () => {
      for (const model of Object.values(modelsFromFiles)) {
        model.dispose();
      }
    };
  }, [isInitialised, Object.keys(files).length]);

  /**
   * Handle model switching and content updates when activeTabId or models change.
   * Debounces file updates to global state to improve performance.
   */
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || !activeTabId) return;
    const editor = editorRef.current;

    const model = models[activeTabId];
    if (model) {
      editor.setModel(model);
    }

    const modifyModelContent = debounce((content: string) => {
      updateFile(activeTabId, { content });
    }, 500);

    // onDidChangeModelLanguage
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
