import React from "react";

import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/ErrorFallback";

import logo from "@/assets/logo.png";
import { config } from "@/config";

export default function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => {
        if (!config.debugMode) {
          return;
        }
        console.log(error);
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="Sycamore Tree" style={{ width: "50px" }}></img>
        <h1>GSON</h1>
      </div>
    </ErrorBoundary>
  );
}
