import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import vue from "@vitejs/plugin-vue";

import Pages from "vite-plugin-pages";
import defname from "./src";

const isBuild = process.env.NODE_ENV === "production";

const buildConfig: Partial<typeof defineConfig> = {
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "vite-plugin-pages-defname",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vite", "@vue/compiler-sfc"],
    },
  },
  plugins: [dts()],
};

const devConfig = {
  root: resolve(__dirname, "./test"),
  plugins: [defname(), vue(), Pages({ dirs: "src" })],
};

export default defineConfig({
  ...(isBuild ? buildConfig : devConfig),
});
