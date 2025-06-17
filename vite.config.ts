import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
  plugins: [glsl(), vue()],
});
