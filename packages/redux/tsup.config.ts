import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    "@reduxjs/toolkit",
    "redux-persist",
    "@react-native-async-storage/async-storage",
    "@reduxjs/toolkit/query",
    "@reduxjs/toolkit/query/react",
  ],
});
