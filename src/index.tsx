import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import App from "@/App";

import "@/styles.css";

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
