import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import {
  Editor as MonacoEditor,
  Monaco,
  MonacoDiffEditor,
} from "@monaco-editor/react";
import { Box } from "@chakra-ui/react";

interface EditorProps {}

export const Editor = (Props: EditorProps) => {
  const monacoRef = useRef(null);
  const [value, setValue] = useState("");
  const currentLine = 1;

  function handleEditorDidMount(editor: MonacoDiffEditor, monaco: Monaco) {
    console.log("Editor has mounted!", editor, monaco);
    monacoRef.current = monaco;
  }

  return (
    <Box p={8} h={"100%"}>
      <MonacoEditor
        width={"100%"}
        height={"100%"}
        // @todo get this props from file object.
        language={"json"}
        theme={"vs-dark"}
        defaultValue={value}
        line={currentLine}
        onMount={handleEditorDidMount}
        onChange={(value) => {
          if (!value) {
            value = "{}";
          }
          setValue(value);
        }}
      />
    </Box>
  );
};
