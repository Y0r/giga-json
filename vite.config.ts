import { defineConfig } from "vite";

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
  resolve: {
    alias: {
      // Optional alias for cleaner imports.
      "@": path.resolve(__dirname, "src"),
    },
  },
});
