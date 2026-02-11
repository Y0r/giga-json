import React from "react";

import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/ErrorFallback";
import { StableLayout } from "@/containers/Layout/StableLayout";
import { IDE } from "@/containers/IDE";

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
