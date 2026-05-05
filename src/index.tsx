import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ChakraProvider } from "@/shared/ui/provider";
import App from "@/App";
import { loader } from "@monaco-editor/react";

import "@/styles.css";

// Configure Monaco loader to use a specific version from CDN.
loader.config({ version: "0.55.1" });

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root container missing in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
