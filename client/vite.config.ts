import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // backend Spring Boot server
        changeOrigin: true,
        secure: false,
        // 👇 if your backend endpoints don’t have /api prefix, uncomment this:
        // rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
});
