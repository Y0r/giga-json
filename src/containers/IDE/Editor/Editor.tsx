import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import { Box } from "@chakra-ui/react";

interface EditorProps {}

export const Editor = (Props: EditorProps) => {
  const [value, setValue] = useState("");

  return (
    <Box p={8} h={"100%"}>
      <MonacoEditor
        width={"100%"}
        height={"100%"}
        language={"json"}
        theme={"vs-dark"}
        defaultValue={value}
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
