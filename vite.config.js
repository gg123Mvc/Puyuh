import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "/Puyuh/",   // ❗ ini wajib
  plugins: [react()],
});
