import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        services: resolve(__dirname, "services.html"),
        about: resolve(__dirname, "about.html"),
        approach: resolve(__dirname, "approach.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
