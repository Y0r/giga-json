import React from "react";
import { FallbackProps } from "react-error-boundary";

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      {error instanceof Error && <pre>{error.message}</pre>}
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};
