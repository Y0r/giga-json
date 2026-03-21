/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

import path from "path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: "src",
  envDir: "..",
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
    // Use esbuild for minification.
    minify: "esbuild",
    assetsDir: "assets",
    rollupOptions: {
      input: path.resolve(__dirname, "src/index.html"),
      output: {
        // Hashing the asset file name for cache busting.
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
    include: ["**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      // Optional alias for cleaner imports.
      "@": path.resolve(__dirname, "src"),
    },
  },
});
