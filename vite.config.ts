import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022",
    outDir: "dist",
    rollupOptions: {
      output: {
        entryFileNames: "bundles/[name]-[hash].js",
        chunkFileNames: "bundles/[name]-[hash].js",
        assetFileNames: "bundles/[name]-[hash][extname]"
      }
    }
  }
});
