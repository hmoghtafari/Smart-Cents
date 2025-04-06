import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    target: "es2022",
  },
  esbuild: {
    target: "es2022",
  },
  server: {
    allowedHosts: ["pm8973-5174.csb.app"],
  },
});
