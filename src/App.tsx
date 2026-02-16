import React from "react";

import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/shared/ErrorFallback";
import { StableLayout } from "@/shared/Layout/StableLayout";
import { IDE } from "@/feature/ide/IDE";

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
      <StableLayout className={"base-layout"}>
        <IDE />
      </StableLayout>
    </ErrorBoundary>
  );
}
