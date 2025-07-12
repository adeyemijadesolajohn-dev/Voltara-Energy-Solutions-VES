import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://45.55.133.211:5144", // backend API
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
