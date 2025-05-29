import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Don't forget to import path

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Map '@/' to the 'src' directory
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
