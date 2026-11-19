import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    // Preserve FFmpeg's relative worker URL during local development.
    exclude: ["@ffmpeg/ffmpeg"],
  },
  worker: {
    format: "es",
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  preview: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
